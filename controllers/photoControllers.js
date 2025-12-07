import Photo from '../models/photoModel.js';
import Event from '../models/eventModel.js';
import Guest from '../models/guestModel.js';
import sendEmail from '../services/ai.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import multer from 'multer';
import mongoose from 'mongoose';

// ESM dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer storage config
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/photos');
    try {
      await fs.mkdir(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({ 
  storage, 
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter 
});

// 1. UPLOAD PHOTOS (✅ FIXED - handles anonymous + user)
export const uploadPhotos = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const eventIdStr = req.body.eventId;
    if (!eventIdStr) {
      return res.status(400).json({
        success: false,
        message: 'eventId is required'
      });
    }

    // ✅ FIX: Convert to ObjectId + handle user properly
    let uploadedBy = null;
    if (req.user?._id || req.user?.id) {
      uploadedBy = req.user._id || req.user.id;
    }

    const photos = [];
    for (const file of req.files) {
      const photo = new Photo({
        eventId: new mongoose.Types.ObjectId(eventIdStr), // ✅ FIXED
        filename: file.filename,
        originalName: file.originalname,
        path: file.path,
        mimetype: file.mimetype,
        size: file.size,
        uploadedBy: uploadedBy ? new mongoose.Types.ObjectId(uploadedBy) : null, // ✅ FIXED
        caption: ''
      });
      await photo.save();
      photos.push(photo);
    }

    res.json({
      success: true,
      message: `${photos.length} photos uploaded successfully`,
      photos
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. GET EVENT PHOTOS (✅ FIXED for new route /event/:eventId)
export const getEventPhotos = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const photos = await Photo.find({ eventId: new mongoose.Types.ObjectId(eventId) })
      .sort({ createdAt: -1 })
      .lean();
    
    res.json({
      success: true,
      photos,
      count: photos.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. DELETE PHOTO (✅ FIXED for new route /photo/:photoId)
export const deletePhoto = async (req, res) => {
  try {
    const photoId = req.params.photoId;
    const photo = await Photo.findById(new mongoose.Types.ObjectId(photoId));
    
    if (!photo) {
      return res.status(404).json({
        success: false,
        message: 'Photo not found'
      });
    }

    // ✅ Ownership check (if user exists)
    if (req.user?._id && photo.uploadedBy && req.user._id.toString() !== photo.uploadedBy.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this photo'
      });
    }

    // Delete file from disk
    try {
      await fs.unlink(photo.path);
    } catch (err) {
      console.log('File already deleted or not found');
    }

    await Photo.findByIdAndDelete(photo._id);
    res.json({ success: true, message: 'Photo deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. SEND PHOTOS TO RSVP'D GUESTS
export const sendPhotosToRsvpGuests = async (req, res) => {
  const { eventId } = req.body;

  try {
    const event = await Event.findById(new mongoose.Types.ObjectId(eventId));
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    const rsvpGuests = await Guest.find({ 
      eventId: new mongoose.Types.ObjectId(eventId), 
      rsvpStatus: 'accepted'
    }).select('email name');

    if (!rsvpGuests.length) {
      return res.json({
        success: true,
        message: "No guests have accepted RSVP yet"
      });
    }

    const photos = await Photo.find({ 
      eventId: new mongoose.Types.ObjectId(eventId) 
    }).select('filename path originalName');

    if (!photos.length) {
      return res.status(404).json({
        success: false,
        message: "No photos found for this event"
      });
    }

    for (const guest of rsvpGuests) {
      const attachments = photos.map(photo => ({
        filename: photo.originalName,
        path: photo.path
      }));

      await sendEmail({
        to: guest.email,
        subject: `📸 ${event.title} - Event Photos`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #8B4513;">📸 Event Photos Ready!</h2>
            <p>Hi <strong>${guest.name}</strong>,</p>
            <p>Thank you for attending <strong>${event.title}</strong>!</p>
            <p>Here are <strong>${photos.length}</strong> photos from the event:</p>
            <ul style="color: #6d4c41;">
              ${photos.map(p => `<li>✨ ${p.originalName}</li>`).join('')}
            </ul>
            <div style="background: #f8f4e9; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <p style="margin: 0; font-weight: bold;">Photos attached above!</p>
            </div>
            <p style="color: #666;">Thanks for being part of the celebration! ✨</p>
          </div>
        `,
        attachments
      });
    }

    res.json({
      success: true,
      message: `${rsvpGuests.length} guests received ${photos.length} photos each`
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { upload };

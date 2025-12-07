import express from 'express';
import { 
  uploadPhotos, 
  getEventPhotos, 
  deletePhoto, 
  sendPhotosToRsvpGuests,
  upload 
} from '../controllers/photoControllers.js';
import { verifyToken } from '../middleware/auth.js';
const router = express.Router();

// 1. UPLOAD PHOTOS (POST body, NO URL param)
router.post('/upload', upload.array('photos', 10),verifyToken, uploadPhotos);

// 2. GET PHOTOS (URL param = eventId)
router.get('/event/:eventId',verifyToken, getEventPhotos);  // ← CHANGED

// 3. DELETE PHOTO (URL param = photoId)  
router.delete('/photo/:photoId',verifyToken, deletePhoto);  // ← CHANGED

// 4. SEND TO RSVP GUESTS (POST body)
router.post('/send-to-rsvp',verifyToken, sendPhotosToRsvpGuests);

export default router;

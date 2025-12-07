import mongoose from 'mongoose';

const photoSchema = new mongoose.Schema({
  eventId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Event', 
    required: true, 
    index: true  // Fast queries by event
  },
  filename: { type: String, required: true },        // "1699324567890-selfie.jpg"
  originalName: { type: String, required: true },    // "selfie.jpg"
  path: { type: String, required: true },            // "/uploads/photos/..."
  mimetype: { type: String, required: true },        // "image/jpeg"
  size: { type: Number, required: true },            // 2048576 (bytes)
  uploadedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  caption: { type: String, default: '' }             // "Family photo"
}, { 
  timestamps: true  // createdAt, updatedAt
});

const Photo = mongoose.models.Photo || mongoose.model('Photo', photoSchema);
export default Photo;

import mongoose from 'mongoose';

const guestSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phoneNo: { type: String, required: false }, // Optional
  rsvpStatus: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' }
}, { timestamps: true });

const Guest = mongoose.models.Guest || mongoose.model('Guest', guestSchema);
export default Guest;

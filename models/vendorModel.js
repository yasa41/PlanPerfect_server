import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, trim: true },
  phoneNo: { type: String, trim: true },
  estimate: { type: Number, required: true }, // Estimated cost or budget
  details: { type: String, trim: true }, // Other relevant info
}, { timestamps: true });

const Vendor = mongoose.models.Vendor || mongoose.model('Vendor', vendorSchema);
export default Vendor;

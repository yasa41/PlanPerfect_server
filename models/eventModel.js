import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  date: { type: Date, required: true },
  venue: { type: String, trim: true, required: true },
  organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, trim: true, default: 'planned' },
  currentStage: { type: String, trim: true, default: 'initial' },
  eventType: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "EventType",
  required: true,
}
}, { timestamps: true });

const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);
export default Event;
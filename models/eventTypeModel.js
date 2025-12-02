import mongoose from 'mongoose';

const eventTypeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // "birthday", "workshop", etc.

  defaultTasks: [
    {
      description: { type: String, required: true },
      status: { type: String, default: "pending" }
    }
  ],
image: { type: String, required: true } ,

  defaultInvites: [
    {
      name: { type: String, required: true },
      content: { type: String, required: true } 
    }
  ],
   defaultVendors: [
    {
      category: { type: String, required: true },  // e.g. "Decoration", "Catering"
      name: { type: String, required: true },      // Vendor name
      estimate: { type: Number, required: true }   // Estimated price
    }
  ]
});

const EventType = mongoose.models.EventType || mongoose.model("EventType", eventTypeSchema);
export default EventType;
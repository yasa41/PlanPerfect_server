import mongoose from 'mongoose';

const eventTypeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },

  defaultTasks: [
    {
      description: { type: String, required: true },
      status: { type: String, default: "pending" }
    }
  ],

  image: { type: String, required: true },

  defaultInvites: [
    {
      name: { type: String, required: true },
      content: { type: String, required: true }
    }
  ],

  defaultVendors: [
    {
      category: { type: String, required: true },
      name: { type: String, required: true },
      estimate: { type: Number, required: true },
       email: { type: String, trim: true, default: "" },
      // ADD THESE TWO FIELDS
      phoneNo: { type: String, trim: true },
      details: { type: String, trim: true },
      imageUrl: {
        type: String,
        trim: true,
      },

      websiteUrl: {
        type: String,
        trim: true,
      }
    }
  ]
});

const EventType =
  mongoose.models.EventType || mongoose.model("EventType", eventTypeSchema);

export default EventType;

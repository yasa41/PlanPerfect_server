import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
    },

    phoneNo: {
      type: String,
      trim: true,
    },

    estimate: {
      type: Number,
      required: true,
    },

    // NEW FIELD
    category: {
      type: String,
      required: true,
      enum: ["catering", "venue", "photography", "decoration", "others"],
      lowercase: true,
      trim: true,
      default: "others",
    },

    // Free text description
    details: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const Vendor =
  mongoose.models.Vendor || mongoose.model("Vendor", vendorSchema);

export default Vendor;

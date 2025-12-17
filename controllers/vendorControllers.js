import Vendor from '../models/vendorModel.js';
import sendEmail from "../services/ai.js";

// Get vendor list for event
export const getVendorsByEvent = async (req, res) => {
  try {
    const vendors = await Vendor.find({ eventId: req.params.eventId });
    res.json({ success: true, vendors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add new vendor
export const addVendor = async (req, res) => {
  try {
    const {
      eventId,
      name,
      email,
      phoneNo,
      estimate,
      category,
      details,
      imageUrl,
      websiteUrl,
    } = req.body;


    if (!category) {
      return res.json({
        success: false,
        message: "Category is required",
      });
    }

    const vendor = new Vendor({
      eventId,
      name,
      email,
      phoneNo,
      estimate,
      category,
      details,
      imageUrl,
      websiteUrl
    });

    await vendor.save();

    res.json({ success: true, vendor });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Update vendor details
export const updateVendor = async (req, res) => {
  try {
    const { vendorId, isHired } = req.body;

    if (typeof isHired !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isHired must be a boolean",
      });
    }

    const vendor = await Vendor.findById(vendorId);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    vendor.isHired = isHired;
    await vendor.save();

    res.json({
      success: true,
      vendor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Delete vendor
export const deleteVendor = async (req, res) => {
  try {
    const { vendorId } = req.body;

    const vendor = await Vendor.findByIdAndDelete(vendorId);

    if (!vendor)
      return res.status(404).json({ success: false, message: 'Vendor not found' });

    res.json({ success: true, message: 'Vendor deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};




export const sendVendorEmail = async (req, res) => {
  try {
    const { vendorId, subject, body } = req.body;

    const vendor = await Vendor.findById(vendorId);
    if (!vendor || !vendor.email) {
      return res.status(404).json({
        success: false,
        message: "Vendor email not found",
      });
    }

    await sendEmail({
      to: vendor.email,
      subject,
      html: body.replace(/\n/g, "<br />"),
    });

    res.json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

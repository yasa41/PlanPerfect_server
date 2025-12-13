import Vendor from '../models/vendorModel.js';

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
      category,   // 🔥 ADD THIS
      details,
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
      category,   // 🔥 SAVE CATEGORY
      details,
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
    const {
      vendorId,
      name,
      email,
      phoneNo,
      estimate,
      category,   // 🔥 ADD THIS
      details,
    } = req.body;

    const vendor = await Vendor.findById(vendorId);
    if (!vendor)
      return res
        .status(404)
        .json({ success: false, message: "Vendor not found" });

    if (name) vendor.name = name;
    if (email) vendor.email = email;
    if (phoneNo) vendor.phoneNo = phoneNo;
    if (estimate !== undefined) vendor.estimate = estimate;
    if (category) vendor.category = category; // 🔥 UPDATE CATEGORY
    if (details) vendor.details = details;

    await vendor.save();

    res.json({ success: true, vendor });
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


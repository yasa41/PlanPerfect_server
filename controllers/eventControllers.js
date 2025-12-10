import Event from "../models/eventModel.js";
import User from "../models/userModel.js";
import EventType from "../models/eventTypeModel.js";
import ToDoList from "../models/toDoListModel.js";
import InviteTemplate from "../models/inviteModel.js";
import Budget from "../models/budgetModel.js";
import Vendor from "../models/vendorModel.js";

// ===============================
// CREATE EVENT (MAIN CONTROLLER)
// ===============================
export const createEvent = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const { title, description, date, venue, eventType } = req.body;

    // Validate input
    if (!title || !date || !venue || !eventType) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields (title, date, venue, eventType)",
      });
    }

    // Find event type template
    const template = await EventType.findOne({ name: eventType });
    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Invalid event type",
      });
    }

    // Create Event with eventType stored as ObjectId reference!
    const event = await Event.create({
      title,
      description,
      date,
      venue,
      eventType: template._id, // Store ObjectId here
      organizerId: userId,
      eventImage: template.image || "",
    });

    // Create To-Do List
    const todoList = await ToDoList.create({
      eventId: event._id,
      tasks: template.defaultTasks,
    });

    // Create Invite Templates
    const invite = await InviteTemplate.create({
      eventId: event._id,
      name: template.defaultInvites[0]?.name,
      content: template.defaultInvites[0]?.content,
    });


    // Create Budget (default 0)
    const budget = await Budget.create({
      eventId: event._id,
      totalBudget: 0,
      spentAmount: 0,
    });

    // Create Default Vendors
    let vendorDocs = [];
    if (template.defaultVendors?.length > 0) {
      for (let v of template.defaultVendors) {
        const vendor = await Vendor.create({
          eventId: event._id,
          name: v.name,
          estimate: v.estimate,
          phoneNo: v.phoneNo,
          details: v.details || v.category,
        });
        vendorDocs.push(vendor);
      }
    }

    // Add event to user's workingEvents
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    user.workingEvents.push(event._id);
    await user.save();

    // Send response
    return res.json({
      success: true,
      message: "Event created successfully",
      event,
      todoList,
      inviteTemplate: invite,
      budget,
      vendors: vendorDocs,
      guests: [],
    });
  } catch (error) {
    console.error("Create Event Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create event",
      error: error.message,
    });
  }
};

// ===============================
// LIST ALL EVENTS
// ===============================
export const listEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json({ success: true, events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===============================
// GET EVENT BY ID
// ===============================
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate({
      path: "eventType",
      select: "name image defaultVendors defaultInvites defaultTasks",
    });
    if (!event)
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });

    res.json({ success: true, event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===============================
// ADD EVENT TO USER WORKING LIST
// ===============================
export const addWorkingEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const { eventId } = req.body;

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    if (!user.workingEvents.includes(eventId)) {
      user.workingEvents.push(eventId);
      await user.save();
    }

    res.json({ success: true, workingEvents: user.workingEvents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===============================
// REMOVE EVENT FROM USER WORKING LIST
// ===============================
export const removeWorkingEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const { eventId } = req.body;

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    user.workingEvents = user.workingEvents.filter(
      (id) => id.toString() !== eventId
    );
    await user.save();

    res.json({ success: true, workingEvents: user.workingEvents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===============================
// GET USER WORKING EVENTS WITH POPULATED EVENT TYPE
// ===============================
export const getWorkingEvents = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).populate({
      path: "workingEvents",
      populate: {
        path: "eventType",       // populate eventType field
        select: "name image"     // retrieve only name and image fields
      }
    });

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, workingEvents: user.workingEvents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


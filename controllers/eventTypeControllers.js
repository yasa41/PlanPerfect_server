import EventType from "../models/eventTypeModel.js";


export const getAllEventTypes = async (req, res) => {
  try {
    const types = await EventType.find();

    res.json({
      success: true,
      message: "Event types fetched successfully",
      types,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch event types",
      error: error.message,
    });
  }
};


export const getEventTypeByName = async (req, res) => {
  try {
    const { name } = req.params;

    const type = await EventType.findOne({ name });

    if (!type) {
      return res.status(404).json({
        success: false,
        message: "Event type not found",
      });
    }

    res.json({
      success: true,
      message: "Event type fetched successfully",
      type,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch event type",
      error: error.message,
    });
  }
};

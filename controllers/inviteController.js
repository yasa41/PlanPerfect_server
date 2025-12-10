import InviteTemplate from "../models/inviteModel.js";
import Event from "../models/eventModel.js";
import Guest from "../models/guestModel.js";
import fs from "fs";
import path from "path";
import sendEmail from "../services/ai.js";


// -------------------------------------------------------------
// GET INVITE TEMPLATE FOR AN EVENT
// -------------------------------------------------------------
export const getInviteTemplate = async (req, res) => {
  try {
    const invite = await InviteTemplate.findOne({ eventId: req.params.eventId });

    if (!invite) {
      return res.status(404).json({
        success: false,
        message: "Invite template not found",
      });
    }

    res.json({ success: true, invite });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// -------------------------------------------------------------
// GENERATE AI INVITE TEXT (unchanged)
// -------------------------------------------------------------
export const generateInviteText = async (req, res) => {
  const { eventId } = req.body;

  try {
    const event = await Event.findById(eventId).populate("eventType");
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    const eventTypeName = event.eventType?.name || "event";
    
    // Date formatting (Dec 12 2025)
    const eventDate = event.date
      ? event.date.toDateString()
      : "a special day";

    // Time formatting (06:30 PM)
    const eventTime = event.date
      ? event.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "Time not specified";

    const message = `
You are warmly invited to our ${eventTypeName.toLowerCase()} ${event.title}.

📅 Date: ${eventDate}
⏰ Time: ${eventTime}
📍 Venue: ${event.venue}

${event.description ? `Details: ${event.description}\n` : ""}

We would be delighted to have you with us as we celebrate this special occasion.
Please join us and make the day even more memorable.

Looking forward to seeing you there!
    `.trim();

    res.json({ success: true, text: message });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// -------------------------------------------------------------
// DOWNLOAD INVITE PDF (USES STORED PDF JUST LIKE EMAIL)
// -------------------------------------------------------------
export const downloadInvitePdf = async (req, res) => {
  const { eventId } = req.body;  // frontend can send anything, we only need eventId

  try {
    // Load stored template
    const inviteTemplate = await InviteTemplate.findOne({ eventId });
    if (!inviteTemplate) {
      return res.status(404).json({
        success: false,
        message: "Invite template not found",
      });
    }

    // Resolve correct PDF path
    const pdfPath = path.resolve("server", inviteTemplate.content);
    const pdfBuffer = fs.readFileSync(pdfPath);

    // Send PDF
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="invite.pdf"',
    });

    res.send(pdfBuffer);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// -------------------------------------------------------------
// SEND INVITE EMAIL WITH STORED PDF FILE
// -------------------------------------------------------------
export const sendInviteEmail = async (req, res) => {
  const { eventId, subject, inviteHtml } = req.body;

  try {
    const guests = await Guest.find({ eventId });
    if (!guests.length) {
      return res.status(404).json({ success: false, message: "No guests found" });
    }

    const inviteTemplate = await InviteTemplate.findOne({ eventId });
    if (!inviteTemplate) {
      return res.status(404).json({ success: false, message: "Invite template not found" });
    }

    // content now contains file path, NOT HTML
    const pdfPath = path.resolve("." + inviteTemplate.content);
    const pdfBuffer = fs.readFileSync(pdfPath);

    for (const guest of guests) {
      await sendEmail({
        to: guest.email,
        subject,
        html: inviteHtml, 
        attachments: [
          {
            filename: "invite.pdf",
            content: pdfBuffer,
          },
        ],
      });
    }

    res.json({
      success: true,
      message: `${guests.length} invite emails sent successfully.`,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

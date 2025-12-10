import axios from "axios";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const BREVO_API_KEY = process.env.BREVO_API_KEY; // Your API V3 Key

/**
 * Send email with HTML + attachments using Brevo API (NOT SMTP)
 */
export default async function sendEmail({
  to,
  subject,
  html,
  attachments = [],
}) {
  // Convert attachments to Base64 (Brevo API requirement)
  const brevoAttachments = attachments.map((file) => {
    const filePath = path.resolve(file.path);
    const fileContent = fs.readFileSync(filePath).toString("base64");

    return {
      name: file.filename,
      content: fileContent,
    };
  });

  const payload = {
    sender: {
      name: "PlanPerfect Events",
      email: "planperfect705@gmail.com", // Must be a VERIFIED Brevo sender
    },
    to: [{ email: to }],

    subject,
    htmlContent: html,

    attachment: brevoAttachments, // IMPORTANT: for Brevo API
  };

  const response = await axios.post(
    "https://api.brevo.com/v3/smtp/email",
    payload,
    {
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data; // for consistency with previous nodemailer behavior
}

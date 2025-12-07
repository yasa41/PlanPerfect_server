import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_USER,        // SMTP LOGIN (example: 9d8277001@smtp-brevo.com)
    pass: process.env.BREVO_SMTP_KEY,    // SMTP KEY (xkeysib-...)
  },
});

/**
 * Send email with HTML + attachments (Brevo)
 */
export default async function sendEmail({
  to,
  subject,
  html,
  attachments = [],
}) {
  return transporter.sendMail({
    from: `"PlanPerfect Events" <planperfect705@gmail.com>`, // HARDCODED
    to,
    subject,
    html,
    attachments,
  });
}

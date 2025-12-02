import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // gmail address
    pass: process.env.EMAIL_PASS, // gmail app password
  },
});

/**
 * Send email with HTML + attachments
 * @param {Object} options
 * @param {string} options.to
 * @param {string} options.subject
 * @param {string} options.html
 * @param {Array}  options.attachments
 */
export default async function sendEmail({ to, subject, html, attachments = [] }) {
  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
    attachments,
  });
}

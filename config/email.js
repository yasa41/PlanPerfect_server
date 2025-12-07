import nodemailer from "nodemailer";

// Create transporter with Brevo SMTP login + key
export const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    // IMPORTANT:
    // Use the Brevo SMTP LOGIN (not your Gmail)
    user: process.env.BREVO_USER,        // e.g. 9d8277001@smtp-brevo.com
    pass: process.env.BREVO_SMTP_KEY,    // your SMTP KEY
  },
});

// Function to send email
export const sendEmail = async (to, subject, text, html = "") => {
  return await transporter.sendMail({
    // Use your VERIFIED sender email here
    from: `"PlanPerfect" <planperfect705@gmail.com>`, 
    to,
    subject,
    text,
    html,
  });
};

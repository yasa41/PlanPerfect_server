import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.BREVO_HOST || "smtp-relay.brevo.com",
  port: Number(process.env.BREVO_PORT) || 587,
  secure: false, // Brevo uses TLS on port 587
  auth: {
    user: process.env.BREVO_USER, // your Gmail that is verified in Brevo
    pass: process.env.BREVO_PASS, // Brevo SMTP key
  },
});

export const sendEmail = async (to, subject, text, html) => {
  return await transporter.sendMail({
    from: process.env.BREVO_USER, // must match a verified Brevo sender
    to,
    subject,
    text,
    html,
  });
};

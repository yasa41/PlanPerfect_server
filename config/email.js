import axios from "axios";

// =============================
// BREVO API CONFIG
// =============================
const BREVO_API_KEY = process.env.BREVO_API_KEY; 
// NOTE: Use your BREVO v3 API KEY, not SMTP key

// =============================
// SEND EMAIL (Brevo HTTP API)
// =============================
export const sendEmail = async (to, subject, text, html = "") => {
  console.log("BREVO KEY LENGTH:", process.env.BREVO_API_KEY?.length);
console.log("BREVO KEY RAW:", JSON.stringify(process.env.BREVO_API_KEY));

  const payload = {
    sender: {
      name: "PlanPerfect",
      email: "planperfect705@gmail.com", // MUST be a Brevo verified sender
    },
    to: [{ email: to }],
    subject,
    textContent: text,
    htmlContent: html || `<p>${text}</p>`,
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

  return response.data; // similar to transporter.sendMail response
};

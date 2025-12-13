import twilio from "twilio";

const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER,
  NODE_ENV,
} = process.env;

// Initialize Twilio client ONLY if creds exist
let client = null;

if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
  client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
}

/**
 * Send OTP via SMS
 * - OTP is ALWAYS generated in controller
 * - SMS is best-effort (never blocks app)
 * - Safe for production deployment
 */
export const sendOtpSms = async (phone, otp) => {
  //  If Twilio not configured, silently skip SMS
  if (!client || !TWILIO_PHONE_NUMBER) {
    if (NODE_ENV !== "production") {
      console.log("OTP (DEV):", otp);
    }
    return { skipped: true };
  }

  try {
    const res = await client.messages.create({
      from: TWILIO_PHONE_NUMBER, // required
      to: phone,                // must be verified on trial
      body: `Your password reset OTP is ${otp}`,
    });

    console.log(" Twilio SMS sent:", res.sid);
    return res;

  } catch (error) {
    console.error("Twilio SMS failed");
    console.error("Code:", error.code);
    console.error("Message:", error.message);

    // Never break OTP flow
    return { failed: true };
  }
};

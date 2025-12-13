import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import { sendEmail } from '../config/email.js';
import { sendOtpSms } from "../config/twilio.js";


export const register = async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password || !phone) {
    return res.json({ success: false, message: "missing details" });
  }

  try {
    // check duplicate email OR phone
    const existingUser = await userModel.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res.json({ success: false, message: "user already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new userModel({
      name,
      email,
      phone, // IMPORTANT
      password: hashedPassword,
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, phone, password } = req.body;

  // Require password + at least one identifier
  if ((!email && !phone) || !password) {
    return res.json({
      success: false,
      message: "Email or phone and password are required",
    });
  }

  try {
    // Find user by email OR phone
    const user = await userModel.findOne({
      $or: [
        email ? { email } : null,
        phone ? { phone } : null,
      ].filter(Boolean),
    });

    if (!user) {
      return res.json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({
        success: false,
        message: "Invalid credentials",
      });
    }

    user.lastActivityDate = new Date();
    await user.save();

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', path: '/'
    })
    return res.json({
      success: true, message: "logged out"
    })

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
}

export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  console.log("requestPasswordReset hit with email:", email);

  if (!email) {
    console.log("No email provided");
    return res.json({ success: false, message: "Email is required" });
  }

  const user = await userModel.findOne({ email });
  if (!user) {
    console.log("User not found for email:", email);
    return res.json({ success: false, message: "User not found" });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordExpire = Date.now() + 300000; // 5 minutes
  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  const message = `You requested a password reset. 
Please use the following link to reset your password:

${resetUrl}

If you did not request this, please ignore this email.`;

  try {
    console.log("Sending reset email to:", user.email);

    await sendEmail(
      user.email,
      "Password Reset Request",
      message,
      `<p>You requested a password reset. Click the link below:</p>
       <p><a href="${resetUrl}">${resetUrl}</a></p>
       <p>If you did not request this, please ignore this email.</p>`
    );

    console.log("Reset email sent successfully");

    return res.json({ success: true, message: "Reset email sent" });

  } catch (error) {
    console.error("Error sending reset email:", error);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return res.json({ success: false, message: "Email could not be sent" });
  }
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword)
    return res.json({ success: false, message: 'Token and new password are required' });

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await userModel.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) return res.json({ success: false, message: 'Invalid or expired token' });

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.json({ success: true, message: 'Password updated successfully' });
};

/* ================================================= */
/* =============== PHONE OTP CONTROLLERS ============ */
/* ================================================= */

/* SEND OTP TO PHONE (MOCK / FUTURE SMS) */
export const requestPasswordResetByPhone = async (req, res) => {
  const { phone } = req.body;

  if (!phone)
    return res.json({ success: false, message: "Phone is required" });

  const user = await userModel.findOne({ phone });
  if (!user)
    return res.json({ success: false, message: "User not found" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  user.phoneResetOtp = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

  user.phoneResetOtpExpire = Date.now() + 5 * 60 * 1000;
  await user.save();
  try {
    await sendOtpSms(phone, otp);
  } catch (e) {}

  return res.json({ success: true, message: "OTP sent" });
};

/* VERIFY PHONE OTP */
export const verifyPhoneOtp = async (req, res) => {
  const { phone, otp } = req.body;

  const user = await userModel.findOne({ phone });
  if (!user)
    return res.json({ success: false, message: "User not found" });

  const hashedOtp = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

  if (
    !user.phoneResetOtp ||
    user.phoneResetOtpExpire < Date.now() ||
    user.phoneResetOtp !== hashedOtp
  ) {
    return res.json({ success: false, message: "Invalid or expired OTP" });
  }

  user.phoneResetOtp = undefined;
  user.phoneResetOtpExpire = undefined;
user.phoneOtpVerified = true;
await user.save();
  await user.save();

  return res.json({ success: true });
};

/* RESET PASSWORD USING PHONE */
export const resetPasswordByPhone = async (req, res) => {
  const { phone, newPassword } = req.body;

  if (!phone || !newPassword) {
    return res.json({ success: false, message: "Missing details" });
  }

  const user = await userModel.findOne({ phone });
  if (!user) {
    return res.json({ success: false, message: "User not found" });
  }

  // 🔒 SECURITY CHECK (IMPORTANT)
  if (!user.phoneOtpVerified) {
    return res.json({
      success: false,
      message: "OTP not verified",
    });
  }

  // Update password
  user.password = await bcrypt.hash(newPassword, 10);

  // Reset OTP verification flag
  user.phoneOtpVerified = false;

  await user.save();

  return res.json({
    success: true,
    message: "Password reset successful",
  });
};


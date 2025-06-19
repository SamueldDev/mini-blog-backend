

import dotenv from "dotenv"
dotenv.config()

import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendResetEmail = async (to, token) => {
  
  // const resetLink = `${process.env.APP_BASE_URL}/api/user/reset-password/${token}`;
  
  const resetLink = `https://blogpage-sam.netlify.app/reset-password/${token}`;

  const msg = {
    to,
    from: process.env.VERIFIED_SENDER_EMAIL, // Must be a verified sender in SendGrid
    subject: "Reset your password",
    body: "Click the link below to reset your password:This link expires in 15 minutes.",
    html: `
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>This link expires in 15 minutes.</p>
    `
  };

  try {
    await sgMail.send(msg);
    console.log(`📩 Reset link sent to ${to}`);
  } catch (error) {
    console.error("❌ SendGrid error:", error.response?.body || error.message);
    throw new Error("Failed to send email");
  }
};

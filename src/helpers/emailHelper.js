import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT === "465",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendOTP = async (email, otpCode) => {
  const message = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset Request",
    html: `
        <div style="font-family: sans-serif; max-width: 400px; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2>Your Verification Code</h2>
          <p>Your one-time password is:</p>
          <h1 style="letter-spacing: 4px; background: #f4f4f4; padding: 10px; text-align: center; border-radius: 4px;">${otpCode}</h1>
          <p style="color: #666; font-size: 12px;">This code expires in 10 minutes. If you didn't request this, ignore this email.</p>
        </div>
      `,
  };
  console.log(message);
  try {
    const email = await transporter.sendMail(message);
    console.log(email);
    return email;
  } catch (error) {
    console.log(error.message);
  }
};

export default sendOTP;

import nodemailer from "nodemailer";
import { AppError } from "../middlewares/globaleerorshandling.js";

// Validate email configuration on startup
const validateEmailConfig = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('EMAIL_USER and EMAIL_PASS environment variables are required');
  }
};

// Validate configuration
validateEmailConfig();

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

export const sendEmail = async (to, subject, textContent, htmlContent, adminEmail = null) => {
  try {
    // Basic validation
    if (!to || !subject) {
      throw new AppError('Email recipient and subject are required', 400);
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      throw new AppError('Invalid email format', 400);
    }

    const transporter = createTransporter();

    // Determine sender email
    const fromEmail = adminEmail || process.env.EMAIL_USER;

    const mailOptions = {
      from: fromEmail,
      to: to,
      subject: subject,
      text: textContent,
      html: htmlContent
    };

    const result = await transporter.sendMail(mailOptions);
    
    console.log(`Email sent successfully to ${to}`);
    return {
      success: true,
      message: 'Email sent successfully',
      data: {
        messageId: result.messageId,
        to: to,
        subject: subject
      }
    };

  } catch (error) {
    console.error("Failed to send email:", error);
    
    if (error instanceof AppError) {
      throw error;
    }
    
    throw new AppError('Failed to send email', 500);
  }
};
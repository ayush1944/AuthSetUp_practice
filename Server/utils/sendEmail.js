import nodemailer from "nodemailer";

let transporter;

/**
 * Initialize transporter once (avoid re-creating for every email).
 */
const initTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_SECURE === "true", // true for port 465
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return transporter;
};

/**
 * Send an email
 * @param {Object} options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text body
 * @param {string} [options.html] - Optional HTML body
 */
export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = initTransporter();

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || "AuthSetup Team"}" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html, // supports rich formatting
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(`✅ Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error("❌ Email not sent:", err.message);
    throw new Error("Email service failed");
  }
};

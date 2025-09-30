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

    // console.log(`✅ Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (err) {
    // console.error("❌ Email not sent:", err.message);
    throw new Error("Email service failed");
  }
};

export const sendWelcomeEmail = async (to, name) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // you can replace with SMTP or provider
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"MyApp Team" <${process.env.EMAIL_USER}>`,
      to,
      subject: "🎉 Welcome to MyApp!",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2 style="color: #4F46E5;">Hi ${name || "there"},</h2>
          <p>Welcome to <b>MyApp</b>! 🎉</p>
          <p>Your account has been created successfully. We’re excited to have you on board.</p>
          <p>You can now login and start exploring your dashboard.</p>
          <br/>
          <p style="font-size: 0.9em; color: #555;">If you did not create this account, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log(`Welcome email sent to ${to}`);
  } catch (err) {
    console.error("Error sending welcome email:", err);
  }
};
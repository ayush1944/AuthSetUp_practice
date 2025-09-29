import prisma from '../lib/db.js'
import bcrypt from 'bcryptjs'
import { sendEmail } from '../utils/sendEmail.js'
import {generateToken} from '../utils/jwt.js'
import { setTokenCookie } from "../utils/setTokenCookie.js";
import { createPasswordResetToken, hashToken } from '../utils/tokenUtils.js';


export const registerController = async (req, res)=>{
   try {
     const { name, age, email, password } = req?.body;

    // if user exist
    const existingUser = await prisma?.user?.findUnique({
        where : { email}
    })

    if(existingUser){
        return res.status(400).json({
            success : false,
            error: true,
            message : "User Already Exists"
        })
    }


    // {This will delete the old register user when he try to register againif he is not verified}
    // If unverified and expired, delete old record
    // const oldUser = await prisma.user.findUnique({ where: { email } });

    // if (oldUser && !oldUser.emailVerified && oldUser.otpExpiresAt < new Date()) {
    //   await prisma.user.delete({ where: { email } });
    // }

    // hashedPassword
    const hashedPassword = await bcrypt.hash(password, 10)

    //  Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000)

    const user = await prisma.user.create({
        data: {
            email: ""+email.toLowerCase(), 
            password: hashedPassword, 
            name: ""+name.toLowerCase(), 
            age: Number(age),
            otp: otp,
            otpExpiresAt: otpExpiresAt
        }
    })

    await sendEmail({
      to: user.email,
      subject: "🔐 Verify Your Email - AuthSetup",
      text: `Your verification code is ${otp}. It will expire in 10 minutes.`,
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; background-color: #fafafa;">
        <h2 style="text-align: center; color: #333;">Welcome to <span style="color:#4F46E5;">AuthSetup</span> 🚀</h2>
        <p style="font-size: 16px; color: #555;">
          To complete your registration, please verify your email by entering the One-Time Password (OTP) below:
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <span style="font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #4F46E5; padding: 12px 24px; border: 2px dashed #4F46E5; border-radius: 8px; display: inline-block;">
            ${otp}
          </span>
        </div>
        <p style="font-size: 14px; color: #777;">
          ⚠️ This code will expire in <strong>10 minutes</strong>. If you didn’t request this, please ignore this email.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
        <p style="font-size: 12px; color: #999; text-align: center;">
          This is an automated message from AuthSetup. Please do not reply directly to this email.
        </p>
      </div>
      `,
    });

    res.status(201).json({ message: "User registered. Please verify OTP." });
   }  catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

export const verifyOtp = async(req, res ) => {
    const { email , otp } = req?.body;

    try {
        const user = await prisma?.user?.findUnique({ where : { email }});

        if (!user) return res.status(400).json({ error: "User not found"})

        if(user?.emailVerified) return res.status(400).json({ error: "Already verified" });

       if (user.otp !== otp || user.otpExpiresAt < new Date()) {
            return res.status(400).json({ error: "Invalid or expired OTP" });
        }

    await prisma.user.update({
      where: { email },
      data: { emailVerified: true, otp: null, otpExpiresAt: null },
    });

    // res.json({ message: " Email verified successfully" });


    const token = generateToken( user.id, user.tokenVersion );

    setTokenCookie(res, token);

    return res.json({
      success: true,
      error: false,
      message: "Registered with verified email",
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const resendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    if (user.emailVerified) {
      return res.status(400).json({ error: "Email already verified" });
    }

    const now = new Date();
    if (user?.lastOtpSentAt && now - user?.lastOtpSentAt < 60 * 1000) {
        const waitTime = Math.ceil((60 * 1000 - (now - user?.lastOtpSentAt))/1000);
        return res.status(429).json({
            error: `Please wait ${waitTime} seconds before requesting a new OTP.`,
            message: `Please wait ${waitTime} seconds before requesting a new OTP.`
        })
    }


    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await prisma.user.update({
      where: { email },
      data: { otp, otpExpiresAt, lastOtpSentAt: now },
    });

    await sendEmail({
      to: user.email,
      subject: "Your New OTP Code - AuthSetup",
      text: `Here is your new verification code: ${otp}. It will expire in 10 minutes.`,
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; background-color: #fafafa;">
        <h2 style="text-align: center; color: #333;">Resend Verification Code</h2>
        <p style="font-size: 16px; color: #555;">
          You requested a new One-Time Password (OTP) for your <strong>AuthSetup</strong> account.
          Use the code below to verify your email:
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <span style="font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #4F46E5; padding: 12px 24px; border: 2px dashed #4F46E5; border-radius: 8px; display: inline-block;">
            ${otp}
          </span>
        </div>
        <p style="font-size: 14px; color: #777;">
           This code will expire in <strong>10 minutes</strong>. If you didn’t request this, please ignore this email.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
        <p style="font-size: 12px; color: #999; text-align: center;">
          This is an automated email from AuthSetup. Please do not reply.
        </p>
      </div>
      `,
    });


    res.json({ message: "New OTP sent to your email" });
  } catch (err) {
    console.error("Error in resendOtp:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const loginController = async( req, res) => {
    const { email , password } = req?.body;

    try {
        const user = await prisma?.user?.findUnique({ where : {email} });

        // check if user exist
        if(!user) return res.status(400).json({
          success: false,
          error: true,
          message: "Invalid credentials"
        })

        // check if user's email is verified or not!
        if(!user.emailVerified) return res.status(400).json({
          success: false,
          error: true,
          message: "Please verify your email first"
        })

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({
          success: false,
          error: true,
          message: "Invalid Credentials"
        })

        //genrate jwt
        const token = generateToken( user.id, user.tokenVersion );

        setTokenCookie(res, token);
        res.json({ 
          success: true,
          error: false,
          message: "Login successful" ,
          user: { id: user.id, email: user.email, name: user.name }
        });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ 
          error: true, 
          success: false,
          message : "Server error" 
        });
    }
}

export const logoutController = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.json({ 
    message: "Logged out successfully" });
};

export const forgotPassword = async (req, res)=>{
  const { email } = req?.body;
  const now = new Date();

  // Always respond with generic message to avoid user enumeration
  // {"message":"If an account with that email exists, you will receive password reset instructions."}
  // This is by design (production best practice).
  // We return a generic message no matter what, so attackers can’t use this endpoint to check if an email is registered (user enumeration attack).
  // If the email exists:
  // A reset token was generated
  // Saved (hashed) in DB
  // An email with reset link/OTP was sent (or at least logged to console in dev).
  // If the email does not exist:
  // Nothing happens, but the user still sees the same generic message.
  const genericResponse = {
    message: "If an account with that email exists, you will receive password reset instructions."
  };

  try {
    if(!email) return res.status(400).json({ 
      error: true,
      success: false,
      message: "Email is required"
     });

     const user = await prisma.user.findUnique({ where: { email}})

     if (!user) {
      // Do not reveal user absence in response
      return res.json(genericResponse);
     }

     // Cooldown check: prevent resending too frequently (per-user)
     if(user.lastPasswordResetSentAt && ( now - user.lastPasswordResetSentAt) < 2 * 60 * 1000) {
      const secondsLeft = Math.ceil((2 * 60 * 1000 - (now - user.lastPasswordResetSentAt)) / 1000);
      return res.status(429).json({ 
        error: `Please wait ${secondsLeft} seconds before requesting a new reset.` });
    }

    const { resetToken, resetTokenHash } = createPasswordResetToken();
    const resetExpiresAt = new Date(now.getTime() + 1 * 60 * 60 * 1000); // 1 hour

    // Store hashed token and sent time
    await prisma.user.update({
      where: { email },
      data: {
        resetToken: resetTokenHash,
        resetExpiresAt,
        lastPasswordResetSentAt: now,
      },
    });

    // Construct reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

    // // Prepare email body (short, actionable)
    // const emailText = `You requested a password reset. Click the link to reset your password (valid for 1 hour):
    // ${resetUrl} If you didn't request this, please ignore this email.`;

    try {
      await sendEmail({
        to: user.email,
        subject: "Reset Your Password - AuthSetup",
        text: `You requested to reset your password. Click the link below (valid for 1 hour): ${resetUrl}`,
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; background-color: #fafafa;">
          <h2 style="text-align: center; color: #333;">Reset Your Password</h2>
          <p style="font-size: 16px; color: #555;">
            We received a request to reset your password for your <strong>AuthSetup</strong> account.
            Click the button below to reset your password:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background:#4F46E5; color:#fff; text-decoration:none; padding: 12px 24px; font-size: 16px; font-weight: bold; border-radius: 6px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="font-size: 14px; color: #777;">
            This link will expire in <strong>1 hour</strong>. If you didn’t request this, you can safely ignore this email.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="font-size: 12px; color: #999; text-align: center;">
            This is an automated email from AuthSetup. Please do not reply.
          </p>
        </div>
        `,
      });

    } catch (mailErr) {
      // If email sending fails, clear token so it can't be used
      await prisma.user.update({
        where : { email },
        data: {   
          resetToken: null, 
          resetExpiresAt: null, 
          lastPasswordResetSentAt: null
        }
      });

      // send audit log
      await prisma.auditLog.create({
        data: {
          userEmail: email,
          action: "FORGOT_PASSWORD",
          ip: req.ip
        }
      });

      console.error("Email send failed:", mailErr);
      return res.status(500).json({ 
        error: false,
        success: true,
        message: "Failed to send email"
       });
    }

    return res.json(genericResponse);
  } catch (err) {
    console.error("Error in forgotPassword:", err);
    return res.status(500).json({ 
      error: true,
      success: false,
      message: "Server error"
    });
  }
};

export const verifyResetToken = async(req, res) =>{
  // optional endpoint to let frontend verify the reset link before showing UI
  const { token , email } = req?.query;
  if(!token || !email) return res.status(400).json({ error: "Missing token or email" });

  try {
    const tokenHash = hashToken(token);

    const user = await prisma.user.findFirst({
      where: {
        email,
        resetToken: tokenHash,
        resetExpiresAt: { gt: new Date() }
      }
    });

    if (!user) return res.status(400).json({ error: "Invalid or expired token" });

    return res.json({ valid: true });
  } catch (err) {
    console.error("Error in verifyResetToken:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const resetPassword = async(req, res) => {
  const { token , email, password} = req.body;
  
  if(!token || !email || !password) return res.status(400).json({ error: "Invalid request" });

  try {
    const tokenHash = hashToken(token);
    const user = await prisma.user.findFirst({
      where: {
        email,
        resetToken: tokenHash,
        resetExpiresAt: { gt: new Date() }
      }
    })

    if (!user) {
      await prisma.auditLog.create({
        data: {
          userEmail: email,
          action: "RESET_FAIL",
          ip: req.ip
        }
      });

      return res.status(400).json({ error: "Invalid or expired token" });
    }

    // hashed new password 
    const hashedPassword = await bcrypt.hash(password, 10);

    // update password, clear token fields, increment tokenVersion (invalidates old JWTs)
    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetExpiresAt: null,
        lastPasswordResetSentAt: null,
        tokenVersion: { increment: 1}, 
      }
    });

    // audit log success
    await prisma.auditLog.create({
    data: {
    userEmail: email,
    action: "RESET_SUCCESS",
    ip: req.ip
    }
  });
     // Optional: If you store sessions in DB, remove them here.
    return res.json({ message: "Password has been reset successfully" });
  } catch (err) {
    console.error("Error in resetPassword:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, age } = req.body;
    const userId = req.userId;
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, age }
    });

    res.json({ message: "Profile updated", user: updatedUser });
  } catch (err) {
    console.error("Update user error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Check old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: "Old password is incorrect" });

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: req.userId },
      data: { password: hashedPassword },
    });

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Error in changePassword:", err);
    res.status(500).json({ error: "Server error" });
  }
};
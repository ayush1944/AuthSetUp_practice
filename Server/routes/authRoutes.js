import express from "express"; 
const router = express.Router();
import { forgotPassword, loginController, logoutController, registerController, resendOtp, resetPassword, verifyOtp, verifyResetToken } from "../controllers/authControllers.js";
import { protect } from "../middleware/authMiddleware.js";
import prisma from "../lib/db.js";
import { forgotPasswordLimiter } from "../middleware/rateLimit.js";

router.post('/register', registerController)
router.post('/verify-otp', verifyOtp)
router.post('/resend-otp', resendOtp)
router.post("/login", loginController);
router.post("/logout", logoutController);
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/verify-reset", verifyResetToken);

router.get("/me", protect, async (req, res) => {
    try {
        console.log("Decoded userId:", req.userId);
        const user = await prisma.user.findUnique({ where: { id: req.userId } });

        if (!user) {
        return res.status(404).json({ error: "User not found" });
        }
        
        res.json({ user });
    } catch (err) {
        console.error("Error in /me route:", err);
        res.status(500).json({ error: "Server error" });
  }
});


export default router
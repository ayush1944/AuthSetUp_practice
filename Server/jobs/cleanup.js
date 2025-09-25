import cron from "node-cron";
import prisma from "../lib/db.js";

// Run every 1 hour to make it every 10 min -> "*/10 * * * *"
cron.schedule("0 * * * *", async () => {
  try {
    const result = await prisma.user.deleteMany({
      where: {
        emailVerified: false,
        otpExpiresAt: { lt: new Date() }, // expired OTP
      },
    });

    if (result.count > 0) {
      console.log(`🧹 Cleanup: Deleted ${result.count} unverified users`);
    }
  } catch (err) {
    console.error(" Error in cleanup job:", err);
  }
});

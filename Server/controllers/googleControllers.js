import { getGoogleClient } from "../lib/openid.js";
import prisma from "../lib/db.js";
import { generateToken } from "../utils/jwt.js";
import { setTokenCookie } from "../utils/setTokenCookie.js";
import { sendWelcomeEmail } from "../utils/sendEmail.js";
export const googleController = async (req, res) => {
  try {
    const client = await getGoogleClient();

    const url = client.authorizationUrl({
      scope: "openid email profile",
      state: "someRandomState123",
      prompt: "select_account", // force re-consent
      //   access_type: "offline", // ask for refresh token (Google only)
      //   nonce: crypto.randomBytes(16).toString("hex"), // extra security
    });

    res.redirect(url);
  } catch (error) {
    console.error("Google OAuth error:", error.message, error.stack);
    res.status(500).json({ error: " Internal Server Error !" });
  }
};

export const googleCallbackController = async (req, res) => {
  try {
    const client = await getGoogleClient();

    const params = client.callbackParams(req);
    const tokenSet = await client.callback(
      `${process.env.BACKEND_URL}/api/auth/google/callback`,
      params,
      { state: "someRandomState123" }
    );

    const userInfo = await client.userinfo(tokenSet.access_token);

    // Extract email & name
    const email = userInfo.email;
    const name = userInfo.name;

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name,
          emailVerified: true,
          provider: "google",
        },
      });

      // If user creation fails
      if (!user) {
        return res
          .status(500)
          .json({ error: "User creation failed during Google OAuth." });
      }

      // Optionally, send welcome email here
      await sendWelcomeEmail(user.email, user.name);
    }

    const token = generateToken(user.id, user.tokenVersion ?? 0);

    setTokenCookie(res, token);

    // Redirect to frontend success page
    res.redirect(`${process.env.FRONTEND_URL}/`);
  } catch (err) {
    console.error("Google OAuth error:", err.message, err.stack);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
  }
};

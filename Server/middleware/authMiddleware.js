import jwt from "jsonwebtoken";
import prisma from "../lib/db.js";

export const protect = async (req, res, next) => {
  const token = req?.cookies?.token;

  if (!token) {
    return res.status(401).json({ error: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    console.log("Decoded JWT payload:", decoded);

    if (!user) return res.status(401).json({ error: "Not authorized" });

    if (user.tokenVersion !== decoded.tokenVersion) {
      return res.status(401).json({ error: "Session invalidated. Please login again." });
    }

    req.userId = user.id;
    next();
  } catch (err) {
    console.error("Protect error:", err);
    return res.status(401).json({ error: "Not authorized" });
  }
};
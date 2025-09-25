import jwt from "jsonwebtoken";

export const generateToken = (userId, tokenVersion = 0) => {
  return jwt.sign({ userId, tokenVersion }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};

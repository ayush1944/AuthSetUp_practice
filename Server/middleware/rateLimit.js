import rateLimit from 'express-rate-limit'

export const forgotPasswordLimiter = rateLimit({
    windowMs: 2 * 60 * 1000, // 2 minutes
    max: 3, // Limit each IP to 3 requests per `window` (here, per 2 minutes)
    message: {
    error: "Too many password reset attempts, please try again later."
  }
})

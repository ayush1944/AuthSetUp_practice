import crypto from "crypto"

export const createPasswordResetToken = ()=>{
    // Generate a random token for password reset
    const resetToken = crypto.randomBytes(32).toString("hex")

    const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex") // using sha-2 series algo 

    return { resetToken, resetTokenHash}
};

export const hashToken = (token)=>{
    return crypto.createHash("sha256").update(token).digest("hex");
}
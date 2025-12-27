import userModel from "../models/userModel.js";
import crypto from "crypto";
import SendEmail from "../utils/SendEmail.js";

export const forgotPassword = async (req, res) => {
  try {
    console.log("🔥 FORGOT PASSWORD HIT");

    const { email } = req.body;
    console.log("📧 EMAIL:", email);

    const user = await userModel.findOne({ email });
    if (!user) {
      console.log("❌ USER NOT FOUND");
      return res.json({ success: false, message: "User not found" });
    }

    console.log("✅ USER FOUND");

    // 1️⃣ CREATE TOKEN
    const resetToken = crypto.randomBytes(32).toString("hex");

    // 2️⃣ HASH TOKEN
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // 3️⃣ SAVE TO DB
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    await user.save();

    console.log("✅ TOKEN SAVED");

    // 4️⃣ RESET URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    console.log("🔗 RESET URL:", resetUrl);

    // 5️⃣ SEND EMAIL (DO NOT BLOCK RESPONSE)
    SendEmail({
      to: user.email,
      subject: "Reset your password",
      text: `Click the link below to reset your password:\n\n${resetUrl}\n\nThis link expires in 15 minutes.`,
    }).catch(err => {
      console.error("EMAIL ERROR:", err.message);
    });

    return res.json({
      success: true,
      message: "Reset link sent to email",
    });

  } catch (error) {
    console.error("❌ FORGOT PASSWORD ERROR:", error);
    return res.json({ success: false, message: error.message });
  }
};

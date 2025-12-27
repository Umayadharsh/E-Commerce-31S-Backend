import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, text }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const forgotPassword = async (req, res) => {
  try {
    console.log("FORGOT PASSWORD HIT"); // 🔥

    const { email } = req.body;
    console.log("EMAIL:", email); // 🔥

    const user = await userModel.findOne({ email });
    if (!user) {
      console.log("USER NOT FOUND");
      return res.json({ success: false, message: "User not found" });
    }

    console.log("USER FOUND");

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    await user.save();

    console.log("TOKEN SAVED");

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    console.log("RESET URL:", resetUrl);

    console.log("SENDING EMAIL..."); // 🔥

    await SendEmail({
      to: user.email,
      subject: "Reset your password",
      text: `Reset link:\n${resetUrl}`,
    });

    console.log("EMAIL SENT ✅"); // 🔥

    return res.json({
      success: true,
      message: "Reset link sent",
    });

  } catch (error) {
    console.error("FORGOT ERROR:", error);
    return res.json({ success: false, message: error.message });
  }
};


    await transporter.sendMail({
      from: `"31S Store" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log("Email sent to:", to);
  } catch (error) {
    console.log("Email error:", error.message);
  }
};

export default sendEmail;

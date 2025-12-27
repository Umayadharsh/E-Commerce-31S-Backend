import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_EMAIL_API);

const SendEmail = async ({ to, subject, text }) => {
  try {
    await resend.emails.send({
      from: "31S Store <onboarding@resend.dev>",
      to,
      subject,
      text,
    });

    console.log("✅ Email sent to:", to);
  } catch (error) {
    console.error("❌ Email send error:", error.message);
    throw error;
  }
};

export default SendEmail;

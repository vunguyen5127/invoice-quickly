import nodemailer from "nodemailer";

const BREVO_CONFIG = {
  host: process.env.MAILER_DOMAIN || "smtp-relay.brevo.com",
  port: parseInt(process.env.MAILER_PORT || "587", 10),
  auth: {
    user: process.env.MAILER_USERNAME,
    pass: process.env.MAILER_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(BREVO_CONFIG);

export async function sendNewUserAlert(userData: {
  email: string;
  name?: string;
  provider?: string;
}) {
  console.log(`[email-service] Attempting to send new user alert for: ${userData.email}`);
  
  const adminEmail = "vunguyencapital@gmail.com";
  
  // Verify connection configuration
  try {
    await transporter.verify();
    console.log("[email-service] SMTP connection verified successfully.");
  } catch (verifyError) {
    // We log the error but don't throw, allowing the app to continue
    console.error("[email-service] SMTP connection verification failed. Email will not be sent:", verifyError);
    return { success: false, error: "SMTP verification failed", details: verifyError };
  }
  
  const mailOptions = {
    from: `"InvoiceQuickly Alert" <support@invoice-quickly.com>`,
    to: adminEmail,
    subject: `🚀 New User Logged In: ${userData.email}`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #2563eb;">New user detected on InvoiceQuickly!</h2>
        <p>A new user has just logged into the platform.</p>
        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Email:</strong> ${userData.email}</p>
          <p><strong>Name:</strong> ${userData.name || "N/A"}</p>
          <p><strong>Provider:</strong> ${userData.provider || "email"}</p>
        </div>
        <p style="font-size: 12px; color: #666;">This is an automated notification from your app.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("[email-service] Admin notification email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    // Critical: log the failure but don't let it crash the main process
    console.error("[email-service] Failed to send admin notification email:", error);
    return { success: false, error };
  }
}

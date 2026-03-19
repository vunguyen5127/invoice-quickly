import nodemailer from "nodemailer";
import { MAILER_DOMAIN, MAILER_PORT, MAILER_USERNAME, MAILER_PASSWORD } from "@/utils/config";

const BREVO_CONFIG = {
  host: MAILER_DOMAIN,
  port: MAILER_PORT,
  auth: {
    user: MAILER_USERNAME,
    pass: MAILER_PASSWORD,
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

export async function sendInvoiceReminderEmail(userData: {
  email: string;
  name?: string;
  overdueInvoices: { invoiceNumber: string; clientName: string; amount: string; currency: string; dueDate: string }[];
  upcomingInvoices: { invoiceNumber: string; clientName: string; amount: string; currency: string; dueDate: string }[];
}) {
  const { email, name, overdueInvoices, upcomingInvoices } = userData;
  const totalItems = overdueInvoices.length + upcomingInvoices.length;
  if (totalItems === 0) return { success: true, skipped: true };

  console.log(`[email-service] Sending invoice reminder to: ${email} (${overdueInvoices.length} overdue, ${upcomingInvoices.length} upcoming)`);

  const overdueSection = overdueInvoices.length > 0 ? `
    <h3 style="color: #dc2626; margin-top: 20px;">⚠️ Overdue Invoices (${overdueInvoices.length})</h3>
    <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
      <tr style="background: #fef2f2; text-align: left;">
        <th style="padding: 8px 12px; border: 1px solid #fecaca;">Invoice</th>
        <th style="padding: 8px 12px; border: 1px solid #fecaca;">Client</th>
        <th style="padding: 8px 12px; border: 1px solid #fecaca;">Amount</th>
        <th style="padding: 8px 12px; border: 1px solid #fecaca;">Due Date</th>
      </tr>
      ${overdueInvoices.map(inv => `
        <tr>
          <td style="padding: 8px 12px; border: 1px solid #fee2e2;">${inv.invoiceNumber}</td>
          <td style="padding: 8px 12px; border: 1px solid #fee2e2;">${inv.clientName}</td>
          <td style="padding: 8px 12px; border: 1px solid #fee2e2;">${inv.currency} ${inv.amount}</td>
          <td style="padding: 8px 12px; border: 1px solid #fee2e2; color: #dc2626; font-weight: bold;">${inv.dueDate}</td>
        </tr>
      `).join('')}
    </table>
  ` : '';

  const upcomingSection = upcomingInvoices.length > 0 ? `
    <h3 style="color: #2563eb; margin-top: 20px;">📋 Due Soon (${upcomingInvoices.length})</h3>
    <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
      <tr style="background: #eff6ff; text-align: left;">
        <th style="padding: 8px 12px; border: 1px solid #bfdbfe;">Invoice</th>
        <th style="padding: 8px 12px; border: 1px solid #bfdbfe;">Client</th>
        <th style="padding: 8px 12px; border: 1px solid #bfdbfe;">Amount</th>
        <th style="padding: 8px 12px; border: 1px solid #bfdbfe;">Due Date</th>
      </tr>
      ${upcomingInvoices.map(inv => `
        <tr>
          <td style="padding: 8px 12px; border: 1px solid #dbeafe;">${inv.invoiceNumber}</td>
          <td style="padding: 8px 12px; border: 1px solid #dbeafe;">${inv.clientName}</td>
          <td style="padding: 8px 12px; border: 1px solid #dbeafe;">${inv.currency} ${inv.amount}</td>
          <td style="padding: 8px 12px; border: 1px solid #dbeafe;">${inv.dueDate}</td>
        </tr>
      `).join('')}
    </table>
  ` : '';

  const subject = overdueInvoices.length > 0
    ? `🔴 You have ${overdueInvoices.length} overdue invoice${overdueInvoices.length > 1 ? 's' : ''}`
    : `📋 ${upcomingInvoices.length} invoice${upcomingInvoices.length > 1 ? 's' : ''} due soon`;

  const mailOptions = {
    from: `"Invoice Quickly" <noreply@invoice-quickly.com>`,
    to: email,
    subject,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="font-size: 20px; color: #18181b;">Invoice Quickly</h1>
        </div>
        <p>Hi${name ? ` ${name}` : ''},</p>
        <p>Here's your daily invoice payment summary:</p>
        ${overdueSection}
        ${upcomingSection}
        <div style="margin-top: 30px; padding: 15px; background: #f9fafb; border-radius: 8px; text-align: center;">
          <a href="https://invoice-quickly.com/dashboard" style="display: inline-block; padding: 10px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">View Dashboard</a>
        </div>
        <p style="font-size: 12px; color: #9ca3af; margin-top: 30px; text-align: center;">This is an automated daily reminder from Invoice Quickly.<br/>You can manage your invoices at <a href="https://invoice-quickly.com/dashboard" style="color: #2563eb;">invoice-quickly.com</a></p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[email-service] Invoice reminder sent to ${email}:`, info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[email-service] Failed to send invoice reminder to ${email}:`, error);
    return { success: false, error };
  }
}

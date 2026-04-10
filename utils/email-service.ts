import config from "@/utils/config";
import nodemailer from "nodemailer";

const BREVO_CONFIG = {
  host: config.mailer.domain,
  port: config.mailer.port,
  auth: {
    user: config.mailer.username,
    pass: config.mailer.password,
  },
};

const transporter = nodemailer.createTransport(BREVO_CONFIG);

export async function sendNewUserAlert(userData: {
  email: string;
  name?: string;
  provider?: string;
}) {
  console.log(`[email-service] Attempting to send new user alert for: ${userData.email}`);
  
  const adminEmail = config.mailer.adminEmail;
  if (!adminEmail) {
    console.warn("[email-service] ADMIN_ALERT_EMAIL not configured — skipping new user alert.");
    return { success: false, error: "Admin email not configured" };
  }
  
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
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${config.siteUrl}/logo.svg" alt="InvoiceQuickly" style="width: 40px; height: 40px;">
        </div>
        <h2 style="color: #0070f3;">New user detected on InvoiceQuickly!</h2>
        <p>A new user has just logged into the platform.</p>
        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Email:</strong> ${userData.email}</p>
          <p><strong>Name:</strong> ${userData.name || "N/A"}</p>
          <p><strong>Provider:</strong> ${userData.provider || "email"}</p>
        </div>
        <p style="color: #666; margin-top: 20px;">This is an automated notification from your app.</p>
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
  overdueInvoices: { invoiceId: string; invoiceNumber: string; clientName: string; amount: string; currency: string; dueDate: string }[];
  upcomingInvoices: { invoiceId: string; invoiceNumber: string; clientName: string; amount: string; currency: string; dueDate: string }[];
}) {
  const { email, name, overdueInvoices, upcomingInvoices } = userData;
  const totalItems = overdueInvoices.length + upcomingInvoices.length;
  if (totalItems === 0) return { success: true, skipped: true };

  console.log(`[email-service] Sending invoice reminder to: ${email} (${overdueInvoices.length} overdue, ${upcomingInvoices.length} upcoming)`);

  const formatTable = (invoices: any[], isOverdue: boolean) => {
    if (invoices.length === 0) return '';
    const title = isOverdue ? `⚠️ Overdue Invoices (${invoices.length})` : `📋 Due Soon (${invoices.length})`;
    const titleColor = isOverdue ? '#dc2626' : '#2563eb';
    const headerBg = isOverdue ? '#fef2f2' : '#f8fafc';
    const borderColor = isOverdue ? '#fecaca' : '#e2e8f0';
    const buttonBg = isOverdue ? '#fee2e2' : '#e0f2fe';
    const buttonColor = isOverdue ? '#b91c1c' : '#0284c7';

    return `
      <h3 style="color: ${titleColor}; margin-top: 32px; margin-bottom: 16px; font-size: 16px; font-weight: 600;">${title}</h3>
      <div style="overflow-x: auto; margin-bottom: 24px;">
        <table style="width: 100%; min-width: 500px; border-collapse: collapse; text-align: left; background: #ffffff; border: 1px solid ${borderColor};">
          <tr style="background: ${headerBg};">
            <th style="width: 18%; padding: 14px 12px; border: 1px solid ${borderColor}; font-weight: 600; color: #1e293b; font-size: 13px;">Invoice</th>
            <th style="width: 36%; padding: 14px 12px; border: 1px solid ${borderColor}; font-weight: 600; color: #1e293b; font-size: 13px;">Client</th>
            <th style="width: 15%; padding: 14px 12px; border: 1px solid ${borderColor}; font-weight: 600; color: #1e293b; font-size: 13px; text-align: center;">Amount</th>
            <th style="width: 16%; padding: 14px 12px; border: 1px solid ${borderColor}; font-weight: 600; color: #1e293b; font-size: 13px; text-align: center;">Due Date</th>
            <th style="width: 15%; padding: 14px 12px; border: 1px solid ${borderColor}; font-weight: 600; color: #1e293b; font-size: 13px; text-align: center;">Action</th>
          </tr>
          ${invoices.map((inv) => `
            <tr>
              <td style="padding: 14px 12px; border: 1px solid ${borderColor}; font-size: 13px; color: #475569; word-break: break-all;">
                <a href="${config.siteUrl}/invoice/${inv.invoiceId}" style="color: #0070f3; text-decoration: underline; font-weight: 500; display: inline-block;">${inv.invoiceNumber}</a>
              </td>
              <td style="padding: 14px 12px; border: 1px solid ${borderColor}; font-size: 13px; color: #475569; line-height: 1.5; word-break: break-word;">${inv.clientName}</td>
              <td style="padding: 14px 12px; border: 1px solid ${borderColor}; font-size: 13px; color: #475569; text-align: center;">${inv.currency} ${inv.amount}</td>
              <td style="padding: 14px 12px; border: 1px solid ${borderColor}; font-size: 13px; color: #475569; text-align: center;">${inv.dueDate}</td>
              <td style="padding: 14px 12px; border: 1px solid ${borderColor}; text-align: center;">
                <a href="${config.siteUrl}/invoice/${inv.invoiceId}" style="display: inline-block; padding: 6px 12px; background: ${buttonBg}; color: ${buttonColor}; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 12px;">View</a>
              </td>
            </tr>
          `).join('')}
        </table>
      </div>
    `;
  };

  const overdueSection = formatTable(overdueInvoices, true);
  const upcomingSection = formatTable(upcomingInvoices, false);

  const subject = overdueInvoices.length > 0
    ? `🔴 You have ${overdueInvoices.length} overdue invoice${overdueInvoices.length > 1 ? 's' : ''}`
    : `📋 ${upcomingInvoices.length} invoice${upcomingInvoices.length > 1 ? 's' : ''} due soon`;

  const mailOptions = {
    from: `"Invoice Quickly" <noreply@invoice-quickly.com>`,
    to: email,
    subject,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          @media screen and (max-width: 600px) {
            .email-container { padding: 20px 10px !important; }
          }
        </style>
      </head>
      <body style="margin: 0; padding: 0; background-color: #ffffff; font-family: 'Segoe UI', Arial, sans-serif;">
        <div class="email-container" style="max-width: 650px; padding: 40px 10px;">
          <p style="font-size: 15px; color: #334155; margin-bottom: 24px; font-weight: 400;">Hi${name ? ` ${name}` : ''},</p>
          <p style="font-size: 15px; color: #334155; margin-bottom: 32px; font-weight: 400;">Here's your daily invoice payment summary:</p>
          
          ${overdueSection}
          ${upcomingSection}
          
          <p style="color: #94a3b8; font-size: 13px; margin-top: 40px; text-align: left; line-height: 1.6;">
            This is an automated daily reminder from Invoice-Quickly.<br/>
            You can manage your invoices at <a href="${config.siteUrl}/dashboard" style="color: #0070f3; text-decoration: underline;">${config.siteUrl.replace(/^https?:\/\//, '')}</a>
          </p>
        </div>
      </body>
      </html>
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

export async function sendTestEmail(toEmail: string) {
  console.log(`[email-service] Sending test email to: ${toEmail}`);
  
  try {
    await transporter.verify();
  } catch (err) {
    return { success: false, error: "SMTP verification failed", details: err };
  }

  const mailOptions = {
    from: `"Invoice Quickly" <noreply@invoice-quickly.com>`,
    to: toEmail,
    subject: "✨ Invoice Quickly: Test Email",
    html: `
      <div style="font-family: sans-serif; padding: 40px; text-align: center; color: #333;">
        <h1 style="color: #0070f3;">Email Service Working!</h1>
        <p>This is a test email from your Admin Panel.</p>
        <p style="margin-top: 20px; font-size: 14px; color: #666;">
          Sent at: ${new Date().toLocaleString()}
        </p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function sendInvoiceToClient(params: {
  clientEmail: string;
  cc?: string;
  companyName: string;
  companyEmail?: string;
  invoiceNumber: string;
  totalAmount: string;
  currency: string;
  dueDate?: string;
  shareUrl: string;
  subject: string;
  message: string;
}) {
  const {
    clientEmail, cc, companyName, companyEmail,
    invoiceNumber, totalAmount, currency,
    dueDate, shareUrl, subject, message,
  } = params;

  const BILLING_EMAIL = "billing@invoice-quickly.com";
  const fromName = `${companyName} via Invoice Quickly`;

  console.log(`[email-service] Sending invoice ${invoiceNumber} to: ${clientEmail}`);

  try {
    await transporter.verify();
  } catch (err) {
    console.error("[email-service] SMTP verification failed:", err);
    return { success: false, error: "SMTP verification failed" };
  }

  // Escape user message for safe HTML rendering (preserve line breaks)
  const escapedMessage = message
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br/>");

  const mailOptions = {
    from: `"${fromName}" <${BILLING_EMAIL}>`,
    replyTo: companyEmail || BILLING_EMAIL,
    to: clientEmail,
    ...(cc ? { cc } : {}),
    subject,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          @media screen and (max-width: 600px) {
            .email-container { padding: 24px 16px !important; }
            .invoice-card { padding: 20px !important; }
          }
        </style>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', Arial, sans-serif;">
        <div class="email-container" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          
          <!-- Message from sender -->
          <div style="margin-bottom: 32px;">
            <p style="font-size: 15px; color: #334155; line-height: 1.7; margin: 0;">
              ${escapedMessage}
            </p>
          </div>

          <!-- Invoice Card -->
          <div class="invoice-card" style="background: #ffffff; border-radius: 12px; padding: 28px; border: 1px solid #e2e8f0; margin-bottom: 32px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #f1f5f9; padding-bottom: 16px;">
              <div>
                <p style="font-size: 12px; color: #94a3b8; margin: 0 0 4px 0; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Invoice</p>
                <p style="font-size: 18px; color: #0f172a; margin: 0; font-weight: 700;">${invoiceNumber}</p>
              </div>
              <div style="text-align: right;">
                <p style="font-size: 12px; color: #94a3b8; margin: 0 0 4px 0; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Amount Due</p>
                <p style="font-size: 22px; color: #0f172a; margin: 0; font-weight: 700;">${currency} ${totalAmount}</p>
              </div>
            </div>
            
            ${dueDate ? `
            <div style="margin-bottom: 24px;">
              <p style="font-size: 12px; color: #94a3b8; margin: 0 0 4px 0; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Due Date</p>
              <p style="font-size: 14px; color: #475569; margin: 0; font-weight: 500;">${dueDate}</p>
            </div>
            ` : ""}

            <div style="text-align: center; padding-top: 8px;">
              <a href="${shareUrl}" 
                 style="display: inline-block; padding: 14px 36px; background: #2563eb; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; letter-spacing: 0.2px;">
                View & Download Invoice
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="text-align: center; padding-top: 16px;">
            <p style="font-size: 12px; color: #94a3b8; margin: 0 0 4px 0;">Sent via</p>
            <a href="${config.siteUrl}" style="color: #2563eb; text-decoration: none; font-weight: 600; font-size: 13px;">Invoice Quickly</a>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[email-service] Invoice ${invoiceNumber} sent to ${clientEmail}:`, info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[email-service] Failed to send invoice to ${clientEmail}:`, error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

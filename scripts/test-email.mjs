import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Manually load .env.local to avoid dependency on 'dotenv'
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env.local');

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const [key, ...valueParts] = trimmedLine.split('=');
      const value = valueParts.join('=');
      if (key && value) {
        process.env[key.trim()] = value.trim();
      }
    }
  });
}

const BREVO_CONFIG = {
  host: process.env.MAILER_DOMAIN || "smtp-relay.brevo.com",
  port: parseInt(process.env.MAILER_PORT || "587", 10),
  auth: {
    user: process.env.MAILER_USERNAME,
    pass: process.env.MAILER_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(BREVO_CONFIG);

async function testEmail() {
  console.log('--- Email Test Script ---');
  console.log(`Host: ${BREVO_CONFIG.host}`);
  console.log(`Port: ${BREVO_CONFIG.port}`);
  console.log(`User: ${BREVO_CONFIG.auth.user}`);
  
  if (!BREVO_CONFIG.auth.user || !BREVO_CONFIG.auth.pass) {
    console.error('Error: MAILER_USERNAME or MAILER_PASSWORD is not set in .env.local');
    process.exit(1);
  }

  try {
    console.log('Verifying SMTP connection...');
    await transporter.verify();
    console.log('SMTP connection verified successfully.');

    const adminEmail = "vunguyencapital@gmail.com";
    const mailOptions = {
      from: `"InvoiceQuickly Test" <support@invoice-quickly.com>`,
      to: adminEmail,
      subject: '🧪 Email Service Test',
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #2563eb;">Testing Email Service</h2>
          <p>This is a test email sent from the <code>scripts/test-email.mjs</code> script.</p>
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Environment:</strong> Development</p>
            <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
          </div>
          <p style="font-size: 12px; color: #666;">If you received this, the email configuration is working correctly.</p>
        </div>
      `,
    };

    console.log(`Sending test email to ${adminEmail}...`);
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.error('Email test failed:', error);
  }
}

testEmail();

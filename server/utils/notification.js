const nodemailer = require('nodemailer');
const twilio = require('twilio');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Twilio client (if configured)
let twilioClient = null;
if (process.env.TWILIO_SID && process.env.TWILIO_TOKEN) {
  twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
}

async function sendEmail(to, subject, text, html) {
  if (!process.env.SMTP_USER) {
    console.warn('SMTP not configured — skipping email send');
    return;
  }
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject,
    text,
    html
  });
}

async function sendSms(to, body) {
  if (!twilioClient) {
    console.warn('Twilio not configured — skipping SMS send');
    return;
  }
  await twilioClient.messages.create({
    from: process.env.TWILIO_FROM,
    to,
    body
  });
}

module.exports = { sendEmail, sendSms };

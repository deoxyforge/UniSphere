const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const logEmail = (to, subject, text, html) => {
  const logDir = path.join(__dirname, '../logs');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  const emailLogFile = path.join(logDir, 'emails.log');
  const logEntry = `[${new Date().toISOString()}]
TO: ${to}
SUBJECT: ${subject}
TEXT: ${text}
HTML: ${html ? 'Available' : 'None'}
----------------------------------------\n`;
  fs.appendFileSync(emailLogFile, logEntry);
  console.log(`\x1b[36m[Email Service Mock]\x1b[0m Email simulated to \x1b[32m${to}\x1b[0m with subject "\x1b[33m${subject}\x1b[0m". Details logged to server/logs/emails.log`);
};

const sendEmail = async ({ to, subject, text, html }) => {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(smtpPort) || 587,
        secure: smtpPort == 465,
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });

      const info = await transporter.sendMail({
        from: process.env.SMTP_FROM || 'UniSphere Events <noreply@unisphere.edu>',
        to,
        subject,
        text,
        html
      });
      console.log(`Email sent via SMTP to ${to}: ${info.messageId}`);
      return true;
    } catch (err) {
      console.error(`SMTP sending failed: ${err.message}. Falling back to file logger.`);
      logEmail(to, subject, text, html);
      return false;
    }
  } else {
    logEmail(to, subject, text, html);
    return true;
  }
};

module.exports = {
  sendEmail
};

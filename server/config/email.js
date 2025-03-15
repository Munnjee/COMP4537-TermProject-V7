// server/config/email.js
const SmtpClient = require('../utils/emailSender');

const emailConfig = {
  host: 'mail.privateemail.com',
  port: 587,
  user: process.env.EMAIL_USER,
  password: process.env.EMAIL_PASSWORD,
  debug: process.env.NODE_ENV !== 'production'
};

module.exports = {
  sendEmail: async function(options) {
    const client = new SmtpClient(emailConfig);
    try {
      return await client.sendMail(options);
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }
};
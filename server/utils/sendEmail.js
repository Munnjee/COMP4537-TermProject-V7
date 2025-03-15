const net = require('net');
const tls = require('tls');
const { promisify } = require('util');

const sendEmail = async (options) => {
  const { email, subject, html } = options;
  const { SMTP_HOST, SMTP_PORT, SMTP_EMAIL, SMTP_PASSWORD, FROM_EMAIL, FROM_NAME } = require('../config/config');
  
  const isSecure = process.env.NODE_ENV === 'production';
  const client = isSecure ? tls.connect(SMTP_PORT, SMTP_HOST) : net.createConnection(SMTP_PORT, SMTP_HOST);
  
  // Helper to wait for server responses
  const waitFor = (client, expectedCode) => {
    return new Promise((resolve, reject) => {
      client.once('data', (data) => {
        const response = data.toString();
        const code = response.substring(0, 3);
        if (code === expectedCode) {
          resolve(response);
        } else {
          reject(new Error(`Unexpected code: ${response}`));
        }
      });
    });
  };
  
  try {
    // Wait for server greeting
    await waitFor(client, '220');
    
    // EHLO command
    client.write(`EHLO ${SMTP_HOST}\r\n`);
    await waitFor(client, '250');
    
    // AUTH LOGIN
    client.write('AUTH LOGIN\r\n');
    await waitFor(client, '334');
    
    // Send username (base64 encoded)
    client.write(Buffer.from(SMTP_EMAIL).toString('base64') + '\r\n');
    await waitFor(client, '334');
    
    // Send password (base64 encoded)
    client.write(Buffer.from(SMTP_PASSWORD).toString('base64') + '\r\n');
    await waitFor(client, '235');
    
    // Mail from
    client.write(`MAIL FROM:<${FROM_EMAIL}>\r\n`);
    await waitFor(client, '250');
    
    // Recipient
    client.write(`RCPT TO:<${email}>\r\n`);
    await waitFor(client, '250');
    
    // Data
    client.write('DATA\r\n');
    await waitFor(client, '354');
    
    // Email content
    const message = [
      `From: ${FROM_NAME} <${FROM_EMAIL}>`,
      `To: <${email}>`,
      `Subject: ${subject}`,
      'Content-Type: text/html; charset=utf-8',
      '',
      html,
      '.',
      ''
    ].join('\r\n');
    
    client.write(message);
    await waitFor(client, '250');
    
    // Quit
    client.write('QUIT\r\n');
    client.end();
    
    console.log('Email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending email:', error.message);
    client.end();
    throw error;
  }
};

module.exports = sendEmail;
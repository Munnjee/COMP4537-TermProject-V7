const net = require('net');
const tls = require('tls');

const sendEmail = async (options) => {
  const { email, subject, html } = options;
  const { SMTP_HOST, SMTP_PORT, SMTP_EMAIL, SMTP_PASSWORD, FROM_EMAIL, FROM_NAME } = require('../config/config');
  
  // Create a plain TCP connection first
  const socket = net.createConnection(SMTP_PORT, SMTP_HOST);
  
  // Helper to wait for server responses
  const waitFor = (expectedCode) => {
    return new Promise((resolve, reject) => {
      socket.once('data', (data) => {
        const response = data.toString();
        console.log('Server response:', response);
        const code = response.substring(0, 3);
        if (code === expectedCode) {
          resolve(response);
        } else {
          reject(new Error(`Unexpected code: ${response}`));
        }
      });
    });
  };
  
  // Handle connection errors
  socket.on('error', (err) => {
    console.error('Socket error:', err);
  });
  
  try {
    // Wait for server greeting
    await waitFor('220');
    
    // EHLO command
    socket.write(`EHLO ${SMTP_HOST}\r\n`);
    await waitFor('250');
    
    // Upgrade connection to TLS using STARTTLS
    socket.write('STARTTLS\r\n');
    await waitFor('220');
    
    // Create TLS socket
    const tlsSocket = await new Promise((resolve, reject) => {
      const tlsOptions = {
        socket: socket,
        host: SMTP_HOST,
        rejectUnauthorized: false // For testing, consider setting to true in production
      };
      
      const secureSocket = tls.connect(tlsOptions, () => {
        if (secureSocket.authorized || !tlsOptions.rejectUnauthorized) {
          resolve(secureSocket);
        } else {
          reject(new Error('TLS authorization failed'));
        }
      });
      
      secureSocket.on('error', (err) => {
        reject(err);
      });
    });
    
    // Replace waitFor to use the TLS socket
    const secureWaitFor = (expectedCode) => {
      return new Promise((resolve, reject) => {
        tlsSocket.once('data', (data) => {
          const response = data.toString();
          console.log('Secure server response:', response);
          const code = response.substring(0, 3);
          if (code === expectedCode) {
            resolve(response);
          } else {
            reject(new Error(`Unexpected code: ${response}`));
          }
        });
      });
    };
    
    // EHLO again after TLS upgrade
    tlsSocket.write(`EHLO ${SMTP_HOST}\r\n`);
    await secureWaitFor('250');
    
    // AUTH LOGIN
    tlsSocket.write('AUTH LOGIN\r\n');
    await secureWaitFor('334');
    
    // Send username (base64 encoded)
    tlsSocket.write(Buffer.from(SMTP_EMAIL).toString('base64') + '\r\n');
    await secureWaitFor('334');
    
    // Send password (base64 encoded)
    tlsSocket.write(Buffer.from(SMTP_PASSWORD).toString('base64') + '\r\n');
    await secureWaitFor('235');
    
    // Mail from
    tlsSocket.write(`MAIL FROM:<${FROM_EMAIL}>\r\n`);
    await secureWaitFor('250');
    
    // Recipient
    tlsSocket.write(`RCPT TO:<${email}>\r\n`);
    await secureWaitFor('250');
    
    // Data
    tlsSocket.write('DATA\r\n');
    await secureWaitFor('354');
    
    // Email content
    const message = [
      `From: ${FROM_NAME} <${FROM_EMAIL}>`,
      `To: <${email}>`,
      `Subject: ${subject}`,
      'MIME-Version: 1.0',
      'Content-Type: text/html; charset=utf-8',
      '',
      html,
      '.',
      ''
    ].join('\r\n');
    
    tlsSocket.write(message);
    await secureWaitFor('250');
    
    // Quit
    tlsSocket.write('QUIT\r\n');
    tlsSocket.end();
    
    console.log('Email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending email:', error.message);
    socket.end();
    throw error;
  }
};

module.exports = sendEmail;
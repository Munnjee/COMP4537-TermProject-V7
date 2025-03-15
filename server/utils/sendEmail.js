const net = require('net');
const tls = require('tls');
const config = require('../config/config');

/**
 * Sends an email using SMTP
 * @param {Object} options - Email options
 * @param {string} options.email - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - Email HTML content
 * @returns {Promise<boolean>} - True if email sent successfully
 */
const sendEmail = async (options) => {
  let socket;
  let connected = false;
  
  try {
    // Email sender configuration
    const host = config.EMAIL_HOST || 'mail.privateemail.com';
    const port = config.EMAIL_PORT || 587;
    const user = config.EMAIL_USER;
    const pass = config.EMAIL_PASSWORD;
    const from = config.EMAIL_FROM || user;

    // Store the recipient email from options
    const recipientEmail = options.email;

    // Connect to SMTP server with longer timeout
    socket = net.createConnection(port, host);
    socket.setTimeout(120000); // 2 minutes timeout
    
    // Promisify socket communication
    const waitForData = (expectedCode) => {
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error(`Timeout waiting for ${expectedCode}`));
        }, 60000); // 1 minute wait for each response
        
        const onData = (data) => {
          const response = data.toString();
          clearTimeout(timeout);
          
          if (response.startsWith(expectedCode)) {
            socket.removeListener('data', onData);
            resolve(response);
          } else {
            socket.removeListener('data', onData);
            reject(new Error(`Expected ${expectedCode}, got: ${response}`));
          }
        };
        
        socket.on('data', onData);
      });
    };
    
    // Send command to server
    const sendCommand = async (command, expectedCode) => {
      socket.write(command + '\r\n');
      return await waitForData(expectedCode);
    };
    
    // Wait for server greeting
    await waitForData('220');
    connected = true;
    
    // Start SMTP conversation
    await sendCommand(`EHLO ${host}`, '250');
    
    // Upgrade to TLS
    await sendCommand('STARTTLS', '220');
    
    // Create secure connection
    return new Promise((resolve, reject) => {
      const tlsOptions = {
        socket,
        host,
        rejectUnauthorized: false
      };
      
      // Upgrade socket to TLS
      socket = tls.connect(tlsOptions, async () => {
        try {
          // Resume SMTP conversation over secure connection
          await sendCommand(`EHLO ${host}`, '250');
          
          // Authenticate
          await sendCommand('AUTH LOGIN', '334');
          await sendCommand(Buffer.from(user).toString('base64'), '334');
          await sendCommand(Buffer.from(pass).toString('base64'), '235');
          
          // Set sender and recipient
          await sendCommand(`MAIL FROM:<${from}>`, '250');
          await sendCommand(`RCPT TO:<${recipientEmail}>`, '250');
          
          // Send email data
          await sendCommand('DATA', '354');
          
          // Format email
          let email = '';
          email += `From: ${from}\r\n`;
          email += `To: ${recipientEmail}\r\n`;
          email += `Subject: ${options.subject}\r\n`;
          email += 'Content-Type: text/plain; charset=utf-8\r\n';
          email += '\r\n';
          email += options.html.replace(/<[^>]*>/g, '');
          email += '\r\n.\r\n';
          
          // Send email content and finish
          await sendCommand(email, '250');
          await sendCommand('QUIT', '221');
          
          // Close connection
          socket.end();
          resolve(true);
        } catch (err) {
          socket.end();
          reject(err);
        }
      });
      
      socket.on('error', (err) => {
        reject(err);
      });
    });
  } catch (error) {
    console.error('Email sending error:', error);
    if (connected && socket) {
      socket.end();
    }
    throw error;
  }
};

module.exports = sendEmail;

// Attribution: ChatGPT was used for structure and organization of the code and Copilot was used to assist in writing the code.
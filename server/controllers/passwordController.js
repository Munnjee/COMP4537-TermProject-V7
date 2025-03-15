const User = require('../models/User');
const PasswordReset = require('../models/PasswordReset');
const sendEmail = require('../utils/sendEmail');
const messages = require('../utils/messages');
const config = require('../config/config');

// @desc    Forgot password
// @route   POST /api/v1/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({
        success: false,
        message: messages.EMAIL_REQUIRED,
      });
    }

    // Find user by email
    const user = await User.findOne({ email });

    // Respond to client immediately with a generic message
    // regardless of whether the user exists (for security)
    res.status(200).json({
      success: true,
      message: messages.PASSWORD_RESET_EMAIL_SENT,
    });

    // If user doesn't exist, we've already responded, so just return
    if (!user) {
      return;
    }

    // The rest of this code now runs in the background after
    // the response has been sent to the client
    process.nextTick(async () => {
      try {
        // Generate token
        const token = PasswordReset.generateToken();

        // Delete any existing password reset tokens for this user
        await PasswordReset.deleteMany({ email });

        // Create new password reset token
        await PasswordReset.create({
          email,
          token,
        });

        // Create reset URL
        const resetUrl = `${config.CLIENT_URL}/reset-password/${token}`;

        // Create plain text email content with the URL
        const plainTextEmail = `
Password Reset Request
You requested a password reset. Please copy and paste the following URL into your browser to reset your password:

${resetUrl}

If you did not request this, please ignore this email and your password will remain unchanged.
This link is valid for 1 hour.
    `;

        // Send email without blocking the response
        await sendEmail({
          email,
          subject: 'Password Reset Request',
          html: plainTextEmail,
        });

        console.log(`Password reset email sent to ${email}`);
      } catch (error) {
        console.error('Background email process error:', error);
      }
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: messages.SERVER_ERROR,
    });
  }
};

// @desc    Reset password
// @route   POST /api/v1/auth/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Validate input
    if (!password) {
      return res.status(400).json({
        success: false,
        message: messages.PASSWORD_REQUIRED,
      });
    }

    // Find the token
    const passwordReset = await PasswordReset.findOne({ token });

    // Check if token exists and is valid
    if (!passwordReset) {
      return res.status(400).json({
        success: false,
        message: messages.INVALID_TOKEN,
      });
    }

    // Find user by email
    const user = await User.findOne({ email: passwordReset.email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: messages.USER_NOT_FOUND,
      });
    }

    // Set new password
    user.password = password;
    await user.save();

    // Delete the token
    await PasswordReset.deleteMany({ email: passwordReset.email });

    // Return success response (without sending confirmation email)
    res.status(200).json({
      success: true,
      message: messages.PASSWORD_RESET_SUCCESS,
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: messages.SERVER_ERROR,
    });
  }
};

// @desc    Verify reset token
// @route   GET /api/v1/auth/verify-reset-token/:token
// @access  Public
exports.verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;

    // Find the token
    const passwordReset = await PasswordReset.findOne({ token });

    // Check if token exists and is valid
    if (!passwordReset) {
      return res.status(400).json({
        success: false,
        message: messages.INVALID_TOKEN,
      });
    }

    res.status(200).json({
      success: true,
      message: messages.VALID_TOKEN,
    });
  } catch (error) {
    console.error('Verify token error:', error);
    res.status(500).json({
      success: false,
      message: messages.SERVER_ERROR,
    });
  }
};

// Attribution: ChatGPT was used for structure and organization of the code and Copilot was used to assist in writing the code.
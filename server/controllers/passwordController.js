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
    
    // We don't want to reveal if a user with this email exists for security reasons
    // So we send a generic message regardless
    if (!user) {
      return res.status(200).json({
        success: true,
        message: messages.PASSWORD_RESET_EMAIL_SENT,
      });
    }

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

    // Create email content
    const html = `
      <h1>Password Reset Request</h1>
      <p>You requested a password reset. Please click on the link below to reset your password:</p>
      <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
      <p>This link is valid for 1 hour.</p>
    `;

    // Send email
    await sendEmail({
      email,
      subject: 'Password Reset Request',
      html,
    });

    res.status(200).json({
      success: true,
      message: messages.PASSWORD_RESET_EMAIL_SENT,
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

    // Send confirmation email
    const html = `
      <h1>Password Reset Successful</h1>
      <p>Your password has been successfully reset.</p>
      <p>If you did not request this change, please contact support immediately.</p>
    `;

    await sendEmail({
      email: user.email,
      subject: 'Password Reset Successful',
      html,
    });

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
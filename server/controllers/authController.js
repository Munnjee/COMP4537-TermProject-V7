// server/controllers/authController.js
const User = require('../models/User');
const messages = require('../utils/messages');
const config = require('../config/config');

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { firstName, email, password } = req.body;

    // Validate input
    if (!firstName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: messages.MISSING_FIELDS,
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: messages.USER_ALREADY_EXISTS,
      });
    }

    // Create user (Admin user can be set manually in the database)
    const user = await User.create({
      firstName,
      email,
      password,
    });

    // Send token response
    sendTokenResponse(user, 201, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: messages.SERVER_ERROR,
    });
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: messages.MISSING_CREDENTIALS,
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: messages.INVALID_CREDENTIALS,
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: messages.INVALID_CREDENTIALS,
      });
    }

    // Send token response
    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: messages.SERVER_ERROR,
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        firstName: user.firstName,
        email: user.email,
        role: user.role,
        apiCallsCount: user.apiCallsCount,
        apiCallsLimit: config.FREE_API_CALLS,
        apiCallsRemaining: Math.max(0, config.FREE_API_CALLS - user.apiCallsCount),
        hasReachedLimit: user.hasReachedApiLimit(),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: messages.SERVER_ERROR,
    });
  }
};

// @desc    Log user out / clear cookie
// @route   GET /api/v1/auth/logout
// @access  Private
exports.logout = (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: messages.USER_LOGGED_OUT,
  });
};

// Helper function to create token, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(Date.now() + config.COOKIE_EXPIRE),
    httpOnly: true,
  };

  // Secure in production
  if (config.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        email: user.email,
        role: user.role,
        apiCallsCount: user.apiCallsCount,
        apiCallsLimit: config.FREE_API_CALLS,
        apiCallsRemaining: Math.max(0, config.FREE_API_CALLS - user.apiCallsCount),
        hasReachedLimit: user.hasReachedApiLimit(),
      },
    });
};
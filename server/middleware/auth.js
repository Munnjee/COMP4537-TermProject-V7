const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');
const messages = require('../utils/messages');
const ApiUsage = require('../models/ApiUsage');

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  // Check for token in cookies or headers
  if (req.cookies.token) {
    token = req.cookies.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: messages.NOT_AUTHORIZED,
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.JWT_SECRET);

    // Find user
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: messages.USER_NOT_FOUND,
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: messages.NOT_AUTHORIZED,
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: messages.NOT_AUTHORIZED_ROLE,
      });
    }
    next();
  };
};

// Track API usage
exports.trackApiUsage = async (req, res, next) => {
  // Skip tracking for auth routes
  if (req.path.startsWith('/api/v1/auth/')) {
    return next();
  }

  try {
    if (req.user) {
      // Always record API usage for analytics purposes
      await ApiUsage.create({
        endpoint: req.path,
        method: req.method,
        user: req.user._id,
      });

      // Only increment API call count for non-admin users
      if (req.user.role !== 'admin') {
        // Increment user's API call count
        await User.findByIdAndUpdate(req.user._id, {
          $inc: { apiCallsCount: 1 },
        });

        // Update user object in request
        req.user = await User.findById(req.user._id);

        // Check if user has reached API limit
        if (req.user.hasReachedApiLimit()) {
          // We continue providing service but with a warning
          req.apiLimitReached = true;
        }
      }
    }
    next();
  } catch (error) {
    console.error('Error tracking API usage:', error);
    next();
  }
};

// Attribution: ChatGPT was used for structure and organization of the code and Copilot was used to assist in writing the code.
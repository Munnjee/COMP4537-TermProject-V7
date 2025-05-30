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

// Track API usage - ONLY for successful requests
exports.trackApiUsage = async (req, res, next) => {
  // Skip tracking for auth routes and documentation
  if (
    req.originalUrl.startsWith('/api/v1/auth/') ||
    req.originalUrl.startsWith('/api/v1/docs')
  ) {
    return next();
  }
  
  try {
    const originalSend = res.send;
    
    res.send = function (body) {
      // Only track if the request was successful (2xx status code)
      if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
        // Record API usage for analytics purposes
        ApiUsage.create({
          endpoint: req.originalUrl,
          method: req.method,
          user: req.user._id,
        }).catch(err => console.error('Error logging API usage:', err));

        // Only increment counter for trivia generation
        if (req.originalUrl.includes('/api/v1/trivia/generate')) {
          User.findByIdAndUpdate(req.user._id, {
            $inc: { apiCallsCount: 1 },
          }).catch(err => console.error('Error updating API calls count:', err));
        }
      }
      
      // Continue with the original response
      originalSend.call(this, body);
    };
    
    next();
  } catch (error) {
    console.error('Error in trackApiUsage middleware:', error);
    next();
  }
};
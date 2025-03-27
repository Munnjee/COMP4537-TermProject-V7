const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const config = require('./config/config');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const apiRoutes = require('./routes/apiRoutes');
const scoreRoutes = require('./routes/scoreRoutes');
const messages = require('./utils/messages');

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (config.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Enable CORS
app.use(
  cors({
    origin: config.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// API Documentation
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Mount routers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/trivia', apiRoutes);
app.use('/api/v1/scores', scoreRoutes);

// 404 handler
app.use((req, res) => {
  // Special handling for admin routes to ensure proper status codes
  if (req.originalUrl.startsWith('/api/v1/admin')) {
    // If it's an admin route, first check authentication
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: messages.AUTHENTICATION_REQUIRED.replace('{route}', req.originalUrl),
      });
    }
    
    // If authenticated but not admin, return 403
    if (req.user && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: messages.ADMIN_ACCESS_REQUIRED.replace('{route}', req.originalUrl),
      });
    }
    
    // If admin but route not found, return 404
    return res.status(404).json({
      success: false,
      message: messages.ADMIN_ROUTE_NOT_FOUND.replace('{route}', req.originalUrl),
    });
  }
  
  // Generic 404 for other routes
  res.status(404).json({
    success: false,
    message: messages.ROUTE_NOT_FOUND.replace('{route}', req.originalUrl),
  });
});

module.exports = app;

// Attribution: ChatGPT was used for structure and organization of the code and Copilot was used to assist in writing the code.
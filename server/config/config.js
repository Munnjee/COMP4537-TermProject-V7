require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5001,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-api-service',
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret_key',
  JWT_EXPIRE: '24h',
  COOKIE_EXPIRE: 24 * 60 * 60 * 1000, // 24 hours
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  FREE_API_CALLS: 20, // Free API calls limit per user

  // Email configuration
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.mailtrap.io',
  SMTP_PORT: process.env.SMTP_PORT || 2525,
  SMTP_EMAIL: process.env.SMTP_EMAIL || 'apikey',
  SMTP_PASSWORD: process.env.SMTP_PASSWORD || 'your_smtp_password',
  FROM_EMAIL: process.env.FROM_EMAIL || 'noreply@seominji.me',
  FROM_NAME: process.env.FROM_NAME || 'COMP4537 V7 Project',

  // OpenAI configuration
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_MODEL: 'gpt-3.5-turbo',
  OPENAI_API_URL: 'https://api.openai.com/v1/chat/completions',
  DEFAULT_QUESTION_COUNT: 5, 
};
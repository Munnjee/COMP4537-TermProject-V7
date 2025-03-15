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

  EMAIL_HOST: process.env.EMAIL_HOST || 'mail.privateemail.com',
  EMAIL_PORT: process.env.EMAIL_PORT || 587,
  EMAIL_USER: process.env.EMAIL_USER || 'noreply@seominji.me',
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@seominji.me',

  // OpenAI configuration
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_MODEL: 'gpt-3.5-turbo',
  OPENAI_API_URL: 'https://api.openai.com/v1/chat/completions',
  DEFAULT_QUESTION_COUNT: 5, 
};
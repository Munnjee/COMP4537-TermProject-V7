module.exports = {
  // Authentication messages
  MISSING_FIELDS: 'Please provide all required fields',
  MISSING_CREDENTIALS: 'Please provide email and password',
  USER_ALREADY_EXISTS: 'User with this email already exists',
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_NOT_FOUND: 'User not found',
  NOT_AUTHORIZED: 'Not authorized to access this resource',
  NOT_AUTHORIZED_ROLE: 'User role not authorized to access this resource',
  USER_LOGGED_OUT: 'User logged out successfully',
  
  // API usage messages
  API_LIMIT_REACHED: 'You have reached your free API calls limit',
  API_LIMIT_WARNING: 'Warning: You are approaching your free API calls limit',
  
  // Server messages
  SERVER_ERROR: 'Server error, please try again later',
  
  // Success messages
  REGISTRATION_SUCCESS: 'User registered successfully',
  LOGIN_SUCCESS: 'User logged in successfully',
  
  // Password reset messages
  EMAIL_REQUIRED: 'Please provide an email address',
  PASSWORD_REQUIRED: 'Please provide a password',
  PASSWORD_RESET_EMAIL_SENT: 'If this email exists in our system, a password reset link has been sent',
  PASSWORD_RESET_SUCCESS: 'Password has been reset successfully',
  INVALID_TOKEN: 'Invalid or expired token',
  VALID_TOKEN: 'Token is valid',
  PASSWORDS_DO_NOT_MATCH: 'Passwords do not match',

  // Trivia messages
  MISSING_TOPIC: 'Please provide a topic for trivia questions',
  TRIVIA_SYSTEM_PROMPT: 'You are a trivia game generator. Create {count} trivia questions about {topic}. Format the response as a JSON array with each question having these properties: question, options (array of 4 choices), correctAnswer (the correct option text in the options array).',
  TRIVIA_USER_PROMPT: 'Generate {count} trivia questions about {topic}',
};
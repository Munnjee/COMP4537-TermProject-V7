const messages = {
  // General messages
  LOADING: 'Loading...',
  SENDING: 'Sending...',
  NO_DATA: 'No data available',
  SERVER_ERROR: 'Server error. Please try again later.',
  NETWORK_ERROR: 'Network error. Please check your connection.',

  // Authentication messages
  LOGIN: 'Login',
  LOGGING_IN: 'Logging in...',
  LOGIN_SUCCESS: 'Login successful!',
  LOGIN_FAILED: 'Login failed. Please check your credentials.',
  LOGOUT: 'Logout',
  LOGOUT_SUCCESS: 'Logout successful!',
  REGISTER: 'Register',
  REGISTERING: 'Registering...',
  REGISTRATION_SUCCESS: 'Registration successful! You are now logged in.',
  REGISTRATION_FAILED: 'Registration failed. Please try again.',
  REGISTER_INFO: "Don't have an account?",
  ALREADY_REGISTERED: 'Already have an account?',

  // Password reset messages
  FORGOT_PASSWORD: 'Forgot Password',
  RESET_PASSWORD: 'Reset Password',
  NEW_PASSWORD: 'New Password',
  NEW_PASSWORD_INFO: 'Enter your new password',
  RESET_PASSWORD_INFO: "Enter your email address and we'll send you a reset link.",
  SEND_RESET_LINK: 'Send Reset Link',
  REQUEST_RESET_LINK: 'Request Password Reset Link',
  PASSWORD_RESET_EMAIL_SENT: 'If your email exists in our system, you will receive a reset link.',
  PASSWORD_RESET_SUCCESS: 'Your password has been reset successfully.',
  PASSWORD_RESET_FAILED: 'Failed to reset password. Please try again.',
  INVALID_RESET_TOKEN: 'This password reset link is invalid or has expired.',
  VERIFYING_RESET_TOKEN: 'Verifying reset link...',
  RESETTING_PASSWORD: 'Resetting...',
  EMAIL_REQUIRED: 'Please enter your email address',
  RETURN_LOGIN: 'Return to Login',

  // Form validation messages
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  PASSWORD_LENGTH: 'Password must be at least 3 characters long.',
  PASSWORDS_DO_NOT_MATCH: 'Passwords do not match.',

  // User input placeholders
  USER_NAME: 'Name',
  USER_NAME_PLACEHOLDER: 'Enter your name',
  EMAIL: 'Email',
  EMAIL_PLACEHOLDER: 'Enter your email',
  PASSWORD: 'Password',
  PASSWORD_PLACEHOLDER: 'Enter your password',
  CONFIRM_PASSWORD: 'Confirm Password',
  CONFIRM_PASSWORD_PLACEHOLDER: 'Confirm your password',

  // API usage messages
  API_LIMIT_REACHED: 'You have reached your free API calls limit.',
  API_LIMIT_WARNING: 'Warning: You run out of 20 free games',

  // Admin panel messages
  ACCESS_DENIED: 'Access Denied',
  ADMIN_ONLY: 'This page is only accessible to administrators.',
  ADMIN_DASHBOARD: 'Admin Dashboard',
  ENDPOINTS_STATS: 'API Endpoints Stats',
  METHOD: 'Method',
  ENDPOINT: 'Endpoint',
  REQUESTS: 'Requests',
  USER_API_USAGE: 'User API Usage',
  USER_MANAGEMENT: 'User Management',
  ROLE: 'Role',
  API_CALLS: 'API Calls',
  ACTION: 'Actions',
  TOTAL_REQUESTS: 'Total Requests',
  ROLE_UPDATED: 'Updated role to',
  MAKE_ADMIN: 'Make Admin',
  MAKE_USER: 'Make User',
  ERROR_UPDATING_ROLE: 'Error updating user role',
  
  // User management messages
  DELETE_USERS: 'Delete Selected',
  DELETE_USERS_CONFIRM: 'Are you sure you want to delete the selected users?',
  DELETE_USERS_SUCCESS: 'Successfully deleted users',
  DELETE_USERS_ERROR: 'Error deleting users',
  CANNOT_DELETE_SELF: 'You cannot delete your own account',
  NO_USERS_SELECTED: 'No users selected for deletion',

  // Homepage messages
  APP_TITLE: "Let's TRIVIA",
  GAMES_PLAYED: 'Games Played: ',
  WELCOME_USER: 'Hi {name}! Ready for a game?',
  START_BUTTON: 'Start',
  START_GAME_TITLE: 'Start a Trivia Game',
  ENTER_TOPIC_PROMPT: 'Enter a topic or choose from popular options:',
  TOPIC_INPUT_PLACEHOLDER: 'Enter your topic...',
  RANDOM_TOPIC: 'Random Topic',
  START_GAME: 'Start Game',

  // Game messages
  DEFAULT_TOPIC: 'General Knowledge',
  LOADING_QUIZ: 'Loading quiz...',
  SCORE: 'SCORE',
  TIME_LEFT: 'TIME LEFT',
  QUIZ_COMPLETE: 'Quiz Complete!',
  CORRECT: 'Correct',
  WRONG: 'Wrong',
  ACCURACY: 'Accuracy',
  QUESTION_REVIEW: 'Question Review',
  BACK_TO_HOME: 'Back to Home',
  CORRECT_ANSWER_FEEDBACK: 'You got it right! ✓',
  INCORRECT_ANSWER: 'Incorrect! The correct answer is:',
  TIMEOUT_FEEDBACK: "Time's up! The answer was:",
  YOU_ANSWERED: 'You answered:',
  CORRECT_ANSWER: 'Correct answer:',
  STREAK_MESSAGE: '{count} in a row!',
  CORRECT_POINTS: 'Correct! +20 points',
  TIMES_UP: "Time's up! The correct answer is:",

  // Game error messages
  QUESTIONS_GENERATION_FAILED: "Couldn't generate questions. Please try again or choose another topic.",
  QUESTIONS_GENERATION_ERROR: 'An error occurred while generating questions. Please try again.',

  // Page not found
  PAGE_NOT_FOUND_TITLE: 'Page Not Found',
  PAGE_NOT_FOUND: 'The page you are looking for does not exist.',
  RETURN_HOME: 'Return to Homepage',
};

export default messages;
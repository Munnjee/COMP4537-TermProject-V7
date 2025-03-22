const messages = {
  // Authentication messages
  LOGIN_SUCCESS: 'Login successful!',
  LOGOUT_SUCCESS: 'Logout successful!',
  REGISTRATION_SUCCESS: 'Registration successful! You are now logged in.',
  LOGIN_FAILED: 'Login failed. Please check your credentials.',
  REGISTRATION_FAILED: 'Registration failed. Please try again.',

  // Form validation messages
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  PASSWORD_LENGTH: 'Password must be at least 3 characters long',

  // API usage messages
  API_LIMIT_REACHED: 'You have reached your free API calls limit.',
  API_LIMIT_WARNING: 'Warning: You run out of 20 free games',

  // Error messages
  SERVER_ERROR: 'Server error. Please try again later.',
  NETWORK_ERROR: 'Network error. Please check your connection.',

  // Admin messages
  ADMIN_ONLY: 'This page is only accessible to administrators.',

  // Password reset messages
  PASSWORD_RESET_EMAIL_SENT:
    'If your email exists in our system, you will receive a password reset link.',
  PASSWORD_RESET_SUCCESS: 'Your password has been reset successfully.',
  PASSWORD_RESET_FAILED: 'Failed to reset password. Please try again.',
  INVALID_RESET_TOKEN: 'This password reset link is invalid or has expired.',
  PASSWORDS_DO_NOT_MATCH: 'Passwords do not match.',
  EMAIL_REQUIRED: 'Please enter your email address',

  // Homepage messages
  APP_TITLE: "Let's TRIVIA",
  GAMES_PLAYED: 'Games Played: ',
  LOGOUT: 'Logout',
  WELCOME_USER: 'Hi {name}! Ready for a game?',
  START_BUTTON: 'Start',
  START_GAME_TITLE: 'Start a Trivia Game',
  ENTER_TOPIC_PROMPT: 'Enter a topic or choose from popular options:',
  TOPIC_INPUT_PLACEHOLDER: 'Enter your topic...',
  RANDOM_TOPIC: 'Random Topic',
  START_GAME: 'Start Game',
  LOADING: 'Loading...',

  // Error alerts
  QUESTIONS_GENERATION_FAILED:
    "Couldn't generate questions. Please try again or choose another topic.",
  QUESTIONS_GENERATION_ERROR:
    'An error occurred while generating questions. Please try again.',
};

export default messages;

# AI-Powered Trivia Quiz Application

This project consists of an AI-powered RESTful API server and a React client web application for generating and playing trivia quizzes on various topics. The application includes user authentication, role-based access control, and usage tracking.

## Project Structure

The project is divided into two main parts:

1. **Server**: Provides the RESTful API endpoints, authentication, and AI-powered trivia generation
2. **Client**: React web application that consumes the API services

## Server Features

- User authentication (register, login, logout)
- Password reset functionality with email
- JWT-based authentication with httpOnly cookies
- Role-based access control (user/admin)
- API usage tracking and limiting
- Admin dashboard with usage statistics
- OpenAI integration for trivia question generation
- MongoDB for data storage
- API documentation with Swagger
- Security features (CORS, XSS protection, rate limiting)

## Client Features

- User registration and login with form validation
- Password reset flow
- Interactive trivia game with multiple topics
- Score tracking and game history
- User dashboard with remaining API usage
- Admin dashboard with API statistics and user management
- Responsive design

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- OpenAI API key

### Installation

#### Server Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the server directory with the following content:
   ```
   PORT=5001
   NODE_ENV=development
   MONGODB_URI=your_mongodb_uri_here
   JWT_SECRET=your_super_secure_jwt_secret_key_here
   CLIENT_URL=http://localhost:3000
   
   # Email configuration (for password reset)
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587  # or 465 for SSL
   SMTP_EMAIL=apikey  # For SendGrid
   SMTP_PASSWORD=your_sendgrid_api_key_here
   FROM_EMAIL=your_registered_sendgrid_email_here
   FROM_NAME=Trivia Quiz App

   # OpenAI configuration
   OPENAI_API_KEY=your_openai_api_key_here
   OPENAI_MODEL=gpt-3.5-turbo
   FREE_API_CALLS=20
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

#### Client Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the client directory with the following content:
   ```
   REACT_APP_API_URL=http://localhost:5001/api/v1
   ```

4. Start the client:
   ```bash
   npm start
   ```

## API Documentation

API documentation is available at:
```
http://localhost:5001/api/v1/docs
```

## User Roles

The application supports two user roles:

- **Regular User**: Can play trivia games with a limit of 20 free API calls
- **Admin**: Has access to the admin dashboard with statistics and user management capabilities

## Creating a User

1. Navigate to the registration page
2. Fill out the form with your name, email, and password
3. Submit the form to create a new account
4. You'll be logged in automatically

## Creating an Admin User

To create an admin user, you can:

1. Register a regular user first
2. Access the MongoDB database directly and change the user's role to "admin"
3. Alternatively, create another admin account through the admin dashboard if you already have an admin account

## AI Integration

The application uses OpenAI's API to generate trivia questions:

1. The server sends a prompt to OpenAI with the requested topic and number of questions
2. The response is parsed into the question format required by the application
3. The questions are sent to the client for the trivia game

## Security Features

- JWT authentication with httpOnly cookies
- Password hashing using bcrypt
- XSS protection
- Rate limiting
- CORS configuration
- Secure password reset flow

## Deployment

For deployment, make sure to:

1. Set the environment variables appropriately for production
2. Update the CORS settings to allow your client domain
3. Ensure your MongoDB instance is secure
4. Configure proper SSL/TLS for HTTPS connections
5. Set the NODE_ENV to 'production'

## License

This project is licensed under the MIT License.

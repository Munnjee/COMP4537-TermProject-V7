# AI-Powered RESTful API Server

This project consists of an AI-powered RESTful API server and a client web application that consumes the services. This is a skeleton project with login, sign-up, and authentication services implemented.

## Project Structure

The project is divided into two main parts:

1. **Server**: Provides the RESTful API endpoints, authentication, and AI-powered services
2. **Client**: Web application that consumes the API services

## Server Features

- User authentication (register, login, logout)
- JWT-based authentication with httpOnly cookies
- API usage tracking
- Admin dashboard with statistics
- MongoDB for data storage
- API documentation with Swagger

## Client Features

- User registration and login
- User dashboard with API usage statistics
- Admin dashboard with advanced statistics and user management

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB

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

   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587  # or 465 for SSL
   SMTP_EMAIL=apikey  # For SendGrid
   SMTP_PASSWORD=your_sendgrid_api_key_here
   FROM_EMAIL=your_registered_sendgrid_email_here
   FROM_NAME=COMP4537 V7 Project
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

## Default Users

- **Admin User**:
  - Email: 
  - Password: 

- **Regular User**:
  - Email: 
  - Password: 

## AI Integration

For the AI-powered part of the project, you'll need to:

1. 

## Deployment

For deployment, make sure to:

1. Host the server and client on different origins
2. Update the `.env` files with production settings
3. Set up proper CORS configuration
4. Ensure the JWT_SECRET is secure

## License

This project is licensed under the MIT License.
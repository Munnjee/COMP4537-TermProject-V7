const app = require('./app');
const connectDB = require('./config/db');
const config = require('./config/config');

// Connect to database
connectDB();

const PORT = config.PORT;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${config.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process with failure
  server.close(() => process.exit(1));
});
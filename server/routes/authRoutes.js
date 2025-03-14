const express = require('express');
const {
  register,
  login,
  getMe,
  editUser,
  logout,
} = require('../controllers/authController');
const {
  forgotPassword,
  resetPassword,
  verifyResetToken,
} = require('../controllers/passwordController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Authentication routes
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/logout', protect, logout);

// Password reset routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/verify-reset-token/:token', verifyResetToken);

// Edit user
router.put('/updatedetails', protect, editUser);

module.exports = router;

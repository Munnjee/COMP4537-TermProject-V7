const mongoose = require('mongoose');
const crypto = require('crypto');

const PasswordResetSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600, // Token expires after 1 hour (in seconds)
  },
});

// Generate a random token
PasswordResetSchema.statics.generateToken = function() {
  return crypto.randomBytes(32).toString('hex');
};

module.exports = mongoose.model('PasswordReset', PasswordResetSchema);
const express = require('express');
const {
  getApiStats,
  getUserStats,
  getUsers,
  updateUserRole,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Protect all routes in this router
router.use(protect);
router.use(authorize('admin'));

router.get('/verify-access', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Admin access verified'
  });
});

router.get('/stats', getApiStats);
router.get('/users/stats', getUserStats);
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);

module.exports = router;
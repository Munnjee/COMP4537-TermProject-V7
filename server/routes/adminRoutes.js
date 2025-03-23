const express = require('express');
const {
  getApiStats,
  getUserStats,
  getUsers,
  updateUserRole,
  deleteUsers
} = require('../controllers/adminController');
const { protect, authorize, trackApiUsage } = require('../middleware/auth');


const router = express.Router();

// Protect all routes in this router
router.use(protect);
router.use(authorize('admin'));
router.use(trackApiUsage); 

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
router.delete('/users', deleteUsers);

// Catch-all route for admin routes that don't exist
router.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Admin route not found: ${req.originalUrl}`
  });
});

module.exports = router;
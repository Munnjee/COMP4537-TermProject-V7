const ApiUsage = require('../models/ApiUsage');
const User = require('../models/User');
const messages = require('../utils/messages');

// @desc    Get API usage statistics
// @route   GET /api/v1/admin/stats
// @access  Private/Admin
exports.getApiStats = async (req, res, next) => {
  try {
    const endpointStats = await ApiUsage.getEndpointStats();

    res.status(200).json({
      success: true,
      data: endpointStats,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: messages.SERVER_ERROR,
    });
  }
};

// @desc    Get user API usage statistics
// @route   GET /api/v1/admin/users/stats
// @access  Private/Admin
exports.getUserStats = async (req, res, next) => {
  try {
    const userStats = await ApiUsage.getUserStats();

    res.status(200).json({
      success: true,
      data: userStats,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: messages.SERVER_ERROR,
    });
  }
};

// @desc    Get all users
// @route   GET /api/v1/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: messages.SERVER_ERROR,
    });
  }
};

// @desc    Update user role
// @route   PUT /api/v1/admin/users/:id/role
// @access  Private/Admin
exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    
    // Validate role
    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: messages.INVALID_ROLE,
      });
    }
    
    // Find user by id
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: messages.USER_NOT_FOUND,
      });
    }
    
    // Update role
    user.role = role;
    await user.save();
    
    res.status(200).json({
      success: true,
      data: user,
      message: messages.USER_ROLE_UPDATED.replace('{role}', role),
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      message: messages.SERVER_ERROR,
    });
  }
};

// @desc    Delete multiple users
// @route   DELETE /api/v1/admin/users
// @access  Private/Admin
exports.deleteUsers = async (req, res, next) => {
  try {
    const { userIds } = req.body;
    
    // Validate userIds
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: messages.NO_VALID_USER_IDS,
      });
    }
    
    // Prevent deleting the current admin user
    if (userIds.includes(req.user.id.toString())) {
      return res.status(400).json({
        success: false,
        message: messages.CANNOT_DELETE_SELF,
      });
    }

    // Handle Leaderboard entries deletion first
    const Leaderboard = require('../models/Leaderboard');
    await Leaderboard.deleteMany({ user: { $in: userIds } });
    
    // Delete API usage data 
    const ApiUsage = require('../models/ApiUsage');
    await ApiUsage.deleteMany({ user: { $in: userIds } });

    // Delete users
    const result = await User.deleteMany({
      _id: { $in: userIds }
    });
    
    res.status(200).json({
      success: true,
      count: result.deletedCount,
      message: messages.USERS_DELETED.replace('{count}', result.deletedCount),
    });
  } catch (error) {
    console.error('Delete users error:', error);
    res.status(500).json({
      success: false,
      message: messages.SERVER_ERROR,
    });
  }
};

// Attribution: ChatGPT was used for structure and organization of the code and Copilot was used to assist in writing the code.
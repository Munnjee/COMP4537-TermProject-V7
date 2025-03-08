const mongoose = require('mongoose');

const ApiUsageSchema = new mongoose.Schema({
  endpoint: {
    type: String,
    required: true,
  },
  method: {
    type: String,
    required: true,
    enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Static method to get endpoint stats
ApiUsageSchema.statics.getEndpointStats = async function () {
  return this.aggregate([
    {
      $group: {
        _id: { endpoint: '$endpoint', method: '$method' },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        endpoint: '$_id.endpoint',
        method: '$_id.method',
        requestCount: '$count',
      },
    },
    {
      $sort: { endpoint: 1, method: 1 },
    },
  ]);
};

// Static method to get user stats
ApiUsageSchema.statics.getUserStats = async function () {
  return this.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'userDetails',
      },
    },
    {
      $unwind: '$userDetails',
    },
    {
      $group: {
        _id: '$user',
        totalRequests: { $sum: 1 },
        email: { $first: '$userDetails.email' },
        firstName: { $first: '$userDetails.firstName' },
      },
    },
    {
      $project: {
        _id: 0,
        userId: '$_id',
        email: 1,
        firstName: 1,
        totalRequests: 1,
      },
    },
    {
      $sort: { totalRequests: -1 },
    },
  ]);
};

module.exports = mongoose.model('ApiUsage', ApiUsageSchema);
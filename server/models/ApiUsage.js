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

// Helper function to normalize endpoint paths
const normalizeEndpoint = (endpoint) => {
  // Replace MongoDB ObjectId pattern with {id}
  // Match the pattern /5f8d0d55b54764421b7156c1 (24 hex chars)
  return endpoint.replace(/\/[0-9a-fA-F]{24}(\/|$)/g, '/{id}$1');
};

// Static method to get endpoint stats
ApiUsageSchema.statics.getEndpointStats = async function () {
  // Get all records
  const results = await this.find({}, 'endpoint method');
  
  // Normalize and count
  const stats = {};
  
  results.forEach(record => {
    const normalizedEndpoint = normalizeEndpoint(record.endpoint);
    const key = `${record.method}:${normalizedEndpoint}`;
    
    if (!stats[key]) {
      stats[key] = {
        method: record.method,
        endpoint: normalizedEndpoint,
        requestCount: 0
      };
    }
    
    stats[key].requestCount++;
  });
  
  // Convert to array and sort
  return Object.values(stats).sort((a, b) => {
    const endpointComparison = a.endpoint.localeCompare(b.endpoint);
    if (endpointComparison !== 0) return endpointComparison;
    return a.method.localeCompare(b.method);
  });
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

// Attribution: ChatGPT was used for structure and organization of the code and Copilot was used to assist in writing the code.
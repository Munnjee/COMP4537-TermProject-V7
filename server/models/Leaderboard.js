const mongoose = require('mongoose');

const LeaderboardSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    firstName: {
        type: String, 
        required: true
    },
    averageAccuracy: {
        type: Number, 
        required: true
    },
    gamesPlayed: {
        type: Number,
        required: true
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

// Index for faster leaderboard queries
LeaderboardSchema.index({ averageAccuracy: -1});

module.exports = mongoose.model('Leaderboard', LeaderboardSchema);

// Attribution: Claude 3.7 Sonnet and Copilot were used to assist in writing the code.
const User = require('../models/User');
const Leaderboard = require('../models/Leaderboard');
const messages = require('../utils/messages');

// @desc    Save a game score
// @route   POST /api/v1/scores
// @access  Private
exports.saveScore = async (req, res) => {
    try {
        const { accuracy } = req.body;

        if (accuracy === undefined) {
            return res.status(400).json({
                success: false,
                message: messages.MISSING_SCORE_DATA
            })
        }

        // get current user
        const user = await User.findById(req.user.id);

        // add accuracy to user's gameScores array
        user.gameScores.push({ accuracy });
        await user.save();

        // calculate average accuracy
        const totalAccuracy = user.gameScores.reduce((sum, score) => sum + score.accuracy, 0);
        const averageAccuracy = totalAccuracy / user.gameScores.length;

        // update or create leaderboard entry
        await Leaderboard.findOneAndUpdate(
            { user: user._id },
            {
                user: user._id,
                firstName: user.firstName,
                averageAccuracy,
                gamesPlayed: user.gameScores.length,
                lastUpdated: new Date()
            },
            { upsert: true, new: true }
        );

        res.status(200).json({
            success: true,
            message: messages.SCORE_SAVED,
            data: {
                accuracy,
                averageAccuracy
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: messages.SERVER_ERROR
        })
    }
}

// @desc    Get leaderboard data
// @route   GET /api/v1/scores/leaderboard
// @access  Private
exports.getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await Leaderboard.find()
            .sort({ averageAccuracy: -1})
            .limit(10);

        res.status(200).json({
            success: true,
            data: leaderboard
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: messages.SERVER_ERROR
        });
    }
};

// Attribution: Claude 3.7 Sonnet and Copilot were used to assist in writing the code.
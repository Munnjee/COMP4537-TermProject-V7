const express = require('express');
const { saveScore, getLeaderboard } = require('../controllers/scoreController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, saveScore);
router.get('/leaderboard', protect, getLeaderboard);

module.exports = router;
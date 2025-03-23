const express = require('express');
const { saveScore, getLeaderboard } = require('../controllers/scoreController');
const { protect, trackApiUsage } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(trackApiUsage);

router.post('/', saveScore);
router.get('/leaderboard', getLeaderboard);

module.exports = router;
const express = require('express');
const { generateTrivia } = require('../controllers/apiController');
const { protect, trackApiUsage } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(trackApiUsage);

router.post('/generate', generateTrivia);

module.exports = router;
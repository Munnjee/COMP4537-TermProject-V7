const express = require('express');
const { generateTrivia } = require('../controllers/apiController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/generate', generateTrivia);

module.exports = router;
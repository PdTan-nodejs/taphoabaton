const express = require('express');
const router = express.Router();
const introController = require('../controllers/introController');

router.get('/', introController.index);

module.exports = router;

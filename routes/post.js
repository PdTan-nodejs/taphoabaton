const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.get('/', postController.list);
router.get('/:slug', postController.detail);

module.exports = router;


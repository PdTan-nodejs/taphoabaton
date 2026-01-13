const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const upload = require('../utils/upload');

// Login routes (no auth required)
router.get('/login', adminController.login);
router.post('/login', adminController.loginPost);
router.get('/logout', adminController.logout);

// Protected routes
router.get('/dashboard', auth, adminController.dashboard);
router.get('/posts', auth, adminController.posts);
router.get('/posts/create', auth, adminController.createPost);
router.post('/posts', auth, upload.single('image'), adminController.storePost);
router.get('/posts/:id/edit', auth, adminController.editPost);
router.post('/posts/:id', auth, upload.single('image'), adminController.updatePost);
router.delete('/posts/:id', auth, adminController.deletePost);

module.exports = router;


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

// Page routes
router.get('/pages', auth, adminController.pages);
router.get('/pages/create', auth, adminController.createPage);
router.post('/pages', auth, adminController.storePage);
router.get('/pages/:id/edit', auth, adminController.editPage);
router.post('/pages/:id', auth, adminController.updatePage);
router.delete('/pages/:id', auth, adminController.deletePage);

// Project routes
router.get('/projects', auth, adminController.projects);
router.get('/projects/create', auth, adminController.createProject);
router.post('/projects', auth, upload.single('image'), adminController.storeProject);
router.get('/projects/:id/edit', auth, adminController.editProject);
router.post('/projects/:id', auth, upload.single('image'), adminController.updateProject);
router.delete('/projects/:id', auth, adminController.deleteProject);

module.exports = router;


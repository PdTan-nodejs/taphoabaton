const db = require('../models');
const bcrypt = require('bcryptjs');
const { createSlug, formatDate, truncate } = require('../utils/helpers');
const fs = require('fs');
const path = require('path');

exports.login = (req, res) => {
  if (req.session.user) {
    return res.redirect('/admin/dashboard');
  }
  res.render('admin/login', {
    title: 'Đăng nhập',
    error: req.query.error || null,
    layout: false
  });
};

exports.loginPost = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await db.User.findOne({ where: { username } });
    
    if (!user) {
      return res.redirect('/admin/login?error=invalid');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.redirect('/admin/login?error=invalid');
    }

    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    };

    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error('Error in adminController.loginPost:', error);
    res.redirect('/admin/login?error=server');
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/admin/login');
  });
};

exports.dashboard = async (req, res) => {
  try {
    const totalPosts = await db.Post.count();
    const publishedPosts = await db.Post.count({ where: { status: 'published' } });
    const draftPosts = await db.Post.count({ where: { status: 'draft' } });
    const totalCategories = await db.Category.count();
    const recentPosts = await db.Post.findAll({
      include: [{
        model: db.Category,
        as: 'category'
      }],
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    res.render('admin/dashboard', {
      title: 'Dashboard',
      totalPosts,
      publishedPosts,
      draftPosts,
      totalCategories,
      recentPosts: recentPosts.map(post => ({
        ...post.toJSON(),
        formattedDate: formatDate(post.createdAt)
      })),
      layout: false
    });
  } catch (error) {
    console.error('Error in adminController.dashboard:', error);
    res.status(500).render('500', { title: 'Lỗi', error });
  }
};

exports.posts = async (req, res) => {
  try {
    const posts = await db.Post.findAll({
      include: [{
        model: db.Category,
        as: 'category'
      }],
      order: [['createdAt', 'DESC']]
    });

    res.render('admin/posts', {
      title: 'Quản lý bài viết',
      posts: posts.map(post => ({
        ...post.toJSON(),
        formattedDate: formatDate(post.createdAt)
      })),
      layout: false
    });
  } catch (error) {
    console.error('Error in adminController.posts:', error);
    res.status(500).render('500', { title: 'Lỗi', error });
  }
};

exports.createPost = async (req, res) => {
  try {
    const categories = await db.Category.findAll();
    res.render('admin/post-form', {
      title: 'Tạo bài viết mới',
      post: null,
      categories,
      layout: false
    });
  } catch (error) {
    console.error('Error in adminController.createPost:', error);
    res.status(500).render('500', { title: 'Lỗi', error });
  }
};

exports.storePost = async (req, res) => {
  try {
    const { title, excerpt, content, categoryId, status } = req.body;
    const slug = createSlug(title);
    const image = req.file ? req.file.filename : null;

    await db.Post.create({
      title,
      slug,
      excerpt,
      content,
      image,
      categoryId: parseInt(categoryId),
      status: status || 'draft'
    });

    res.redirect('/admin/posts');
  } catch (error) {
    console.error('Error in adminController.storePost:', error);
    res.redirect('/admin/posts/create?error=1');
  }
};

exports.editPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await db.Post.findByPk(id);
    const categories = await db.Category.findAll();

    if (!post) {
      return res.status(404).render('404', { title: 'Không tìm thấy bài viết' });
    }

    res.render('admin/post-form', {
      title: 'Chỉnh sửa bài viết',
      post,
      categories,
      layout: false
    });
  } catch (error) {
    console.error('Error in adminController.editPost:', error);
    res.status(500).render('500', { title: 'Lỗi', error });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, excerpt, content, categoryId, status } = req.body;
    const slug = createSlug(title);

    const post = await db.Post.findByPk(id);
    if (!post) {
      return res.status(404).render('404', { title: 'Không tìm thấy bài viết' });
    }

    // Handle image upload
    let image = post.image;
    if (req.file) {
      // Delete old image if exists
      if (post.image) {
        const oldImagePath = path.join(__dirname, '../uploads', post.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      image = req.file.filename;
    }

    await post.update({
      title,
      slug,
      excerpt,
      content,
      image,
      categoryId: parseInt(categoryId),
      status: status || 'draft'
    });

    res.redirect('/admin/posts');
  } catch (error) {
    console.error('Error in adminController.updatePost:', error);
    res.redirect(`/admin/posts/${id}/edit?error=1`);
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await db.Post.findByPk(id);

    if (!post) {
      return res.status(404).json({ error: 'Không tìm thấy bài viết' });
    }

    // Delete image if exists
    if (post.image) {
      const imagePath = path.join(__dirname, '../uploads', post.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await post.destroy();
    res.json({ success: true });
  } catch (error) {
    console.error('Error in adminController.deletePost:', error);
    res.status(500).json({ error: 'Lỗi khi xóa bài viết' });
  }
};


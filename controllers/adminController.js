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
    const totalPages = await db.Page.count();
    const totalProjects = await db.Project.count();
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
      totalPages,
      totalProjects,
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

// Page CRUD
exports.pages = async (req, res) => {
  try {
    const pages = await db.Page.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.render('admin/pages', {
      title: 'Quản lý trang',
      pages: pages.map(page => ({
        ...page.toJSON(),
        formattedDate: formatDate(page.createdAt)
      })),
      layout: false
    });
  } catch (error) {
    console.error('Error in adminController.pages:', error);
    res.status(500).render('500', { title: 'Lỗi', error });
  }
};

exports.createPage = async (req, res) => {
  try {
    res.render('admin/page-form', {
      title: 'Tạo trang mới',
      page: null,
      layout: false
    });
  } catch (error) {
    console.error('Error in adminController.createPage:', error);
    res.status(500).render('500', { title: 'Lỗi', error });
  }
};

exports.storePage = async (req, res) => {
  try {
    const { title, content, metaTitle, metaDescription, status } = req.body;
    const slug = createSlug(title);

    await db.Page.create({
      title,
      slug,
      content,
      metaTitle,
      metaDescription,
      status: status || 'draft'
    });

    res.redirect('/admin/pages');
  } catch (error) {
    console.error('Error in adminController.storePage:', error);
    res.redirect('/admin/pages/create?error=1');
  }
};

exports.editPage = async (req, res) => {
  try {
    const { id } = req.params;
    const page = await db.Page.findByPk(id);

    if (!page) {
      return res.status(404).render('404', { title: 'Không tìm thấy trang' });
    }

    res.render('admin/page-form', {
      title: 'Chỉnh sửa trang',
      page,
      layout: false
    });
  } catch (error) {
    console.error('Error in adminController.editPage:', error);
    res.status(500).render('500', { title: 'Lỗi', error });
  }
};

exports.updatePage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, metaTitle, metaDescription, status } = req.body;
    const slug = createSlug(title);

    const page = await db.Page.findByPk(id);
    if (!page) {
      return res.status(404).render('404', { title: 'Không tìm thấy trang' });
    }

    await page.update({
      title,
      slug,
      content,
      metaTitle,
      metaDescription,
      status: status || 'draft'
    });

    res.redirect('/admin/pages');
  } catch (error) {
    console.error('Error in adminController.updatePage:', error);
    res.redirect(`/admin/pages/${id}/edit?error=1`);
  }
};

exports.deletePage = async (req, res) => {
  try {
    const { id } = req.params;
    const page = await db.Page.findByPk(id);

    if (!page) {
      return res.status(404).json({ error: 'Không tìm thấy trang' });
    }

    await page.destroy();
    res.json({ success: true });
  } catch (error) {
    console.error('Error in adminController.deletePage:', error);
    res.status(500).json({ error: 'Lỗi khi xóa trang' });
  }
};

// Project CRUD
exports.projects = async (req, res) => {
  try {
    const projects = await db.Project.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.render('admin/projects', {
      title: 'Quản lý dự án',
      projects: projects.map(project => ({
        ...project.toJSON(),
        formattedDate: formatDate(project.createdAt)
      })),
      layout: false
    });
  } catch (error) {
    console.error('Error in adminController.projects:', error);
    res.status(500).render('500', { title: 'Lỗi', error });
  }
};

exports.createProject = async (req, res) => {
  try {
    res.render('admin/project-form', {
      title: 'Tạo dự án mới',
      project: null,
      layout: false
    });
  } catch (error) {
    console.error('Error in adminController.createProject:', error);
    res.status(500).render('500', { title: 'Lỗi', error });
  }
};

exports.storeProject = async (req, res) => {
  try {
    const { title, description, content, link, featured, status } = req.body;
    const slug = createSlug(title);
    const image = req.file ? req.file.filename : null;

    await db.Project.create({
      title,
      slug,
      description,
      content,
      image,
      link,
      featured: featured === 'on' || featured === true,
      status: status || 'draft'
    });

    res.redirect('/admin/projects');
  } catch (error) {
    console.error('Error in adminController.storeProject:', error);
    res.redirect('/admin/projects/create?error=1');
  }
};

exports.editProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await db.Project.findByPk(id);

    if (!project) {
      return res.status(404).render('404', { title: 'Không tìm thấy dự án' });
    }

    res.render('admin/project-form', {
      title: 'Chỉnh sửa dự án',
      project,
      layout: false
    });
  } catch (error) {
    console.error('Error in adminController.editProject:', error);
    res.status(500).render('500', { title: 'Lỗi', error });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, content, link, featured, status } = req.body;
    const slug = createSlug(title);

    const project = await db.Project.findByPk(id);
    if (!project) {
      return res.status(404).render('404', { title: 'Không tìm thấy dự án' });
    }

    // Handle image upload
    let image = project.image;
    if (req.file) {
      // Delete old image if exists
      if (project.image) {
        const oldImagePath = path.join(__dirname, '../uploads', project.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      image = req.file.filename;
    }

    await project.update({
      title,
      slug,
      description,
      content,
      image,
      link,
      featured: featured === 'on' || featured === true,
      status: status || 'draft'
    });

    res.redirect('/admin/projects');
  } catch (error) {
    console.error('Error in adminController.updateProject:', error);
    res.redirect(`/admin/projects/${id}/edit?error=1`);
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await db.Project.findByPk(id);

    if (!project) {
      return res.status(404).json({ error: 'Không tìm thấy dự án' });
    }

    // Delete image if exists
    if (project.image) {
      const imagePath = path.join(__dirname, '../uploads', project.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await project.destroy();
    res.json({ success: true });
  } catch (error) {
    console.error('Error in adminController.deleteProject:', error);
    res.status(500).json({ error: 'Lỗi khi xóa dự án' });
  }
};
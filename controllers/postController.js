const db = require('../models');
const { formatDate, truncate } = require('../utils/helpers');

exports.list = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 9;
    const offset = (page - 1) * limit;
    const categorySlug = req.query.category;

    let whereClause = { status: 'published' };
    let category = null;

    if (categorySlug) {
      category = await db.Category.findOne({ where: { slug: categorySlug } });
      if (category) {
        whereClause.categoryId = category.id;
      }
    }

    const { count, rows: posts } = await db.Post.findAndCountAll({
      where: whereClause,
      include: [{
        model: db.Category,
        as: 'category'
      }],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    const categories = await db.Category.findAll({
      include: [{
        model: db.Post,
        as: 'posts',
        where: { status: 'published' },
        required: false
      }]
    });

    const totalPages = Math.ceil(count / limit);

    res.render('post/list', {
      title: category ? category.name : 'Danh sách bài viết',
      posts: posts.map(post => ({
        ...post.toJSON(),
        formattedDate: formatDate(post.createdAt),
        truncatedExcerpt: truncate(post.excerpt || post.content, 200)
      })),
      categories,
      currentCategory: category,
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    });
  } catch (error) {
    console.error('Error in postController.list:', error);
    res.status(500).render('500', { title: 'Lỗi', error });
  }
};

exports.detail = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const post = await db.Post.findOne({
      where: { slug, status: 'published' },
      include: [{
        model: db.Category,
        as: 'category'
      }]
    });

    if (!post) {
      return res.status(404).render('404', { title: 'Không tìm thấy bài viết' });
    }

    // Increment views
    await post.increment('views');

    // Get related posts
    const relatedPosts = await db.Post.findAll({
      where: {
        categoryId: post.categoryId,
        status: 'published',
        id: { [db.Sequelize.Op.ne]: post.id }
      },
      include: [{
        model: db.Category,
        as: 'category'
      }],
      order: [['createdAt', 'DESC']],
      limit: 4
    });

    res.render('post/detail', {
      title: post.title,
      post: {
        ...post.toJSON(),
        formattedDate: formatDate(post.createdAt)
      },
      relatedPosts: relatedPosts.map(p => ({
        ...p.toJSON(),
        formattedDate: formatDate(p.createdAt),
        truncatedExcerpt: truncate(p.excerpt || p.content, 100)
      }))
    });
  } catch (error) {
    console.error('Error in postController.detail:', error);
    res.status(500).render('500', { title: 'Lỗi', error });
  }
};


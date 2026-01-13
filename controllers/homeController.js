const db = require('../models');
const { formatDate, truncate } = require('../utils/helpers');

exports.index = async (req, res) => {
  try {
    const posts = await db.Post.findAll({
      where: { status: 'published' },
      include: [{
        model: db.Category,
        as: 'category'
      }],
      order: [['createdAt', 'DESC']],
      limit: 6
    });

    const categories = await db.Category.findAll({
      include: [{
        model: db.Post,
        as: 'posts',
        where: { status: 'published' },
        required: false
      }]
    });

    res.render('home/index', {
      title: 'Trang chủ',
      posts: posts.map(post => ({
        ...post.toJSON(),
        formattedDate: formatDate(post.createdAt),
        truncatedExcerpt: truncate(post.excerpt || post.content, 150)
      })),
      categories
    });
  } catch (error) {
    console.error('Error in homeController.index:', error);
    res.status(500).render('500', { title: 'Lỗi', error });
  }
};


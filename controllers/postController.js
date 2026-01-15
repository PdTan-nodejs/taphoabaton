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

    const pageTitle = category ? category.name : 'Danh sách bài viết';
    const pageDescription = category 
      ? `Danh sách bài viết thuộc danh mục ${category.name}. Khám phá những bài viết hay và bổ ích.`
      : 'Khám phá danh sách tất cả các bài viết hay và bổ ích trên Tạp Hóa Bất ổn.';

    res.render('post/list', {
      title: pageTitle,
      metaDescription: pageDescription,
      metaKeywords: category ? `${category.name}, bài viết, blog` : 'bài viết, blog, danh sách bài viết',
      ogTitle: `${pageTitle} - Tạp Hóa Bất ổn`,
      ogDescription: pageDescription,
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

    const metaDescription = post.excerpt || truncate(post.content, 160);
    const ogImage = post.image ? `${req.protocol}://${req.get('host')}/uploads/${post.image}` : null;
    const ogUrl = `${req.protocol}://${req.get('host')}/posts/${post.slug}`;

    res.render('post/detail', {
      title: post.title,
      metaDescription: metaDescription,
      metaKeywords: `${post.category.name}, ${post.title}, bài viết, blog`,
      ogTitle: post.title,
      ogDescription: metaDescription,
      ogType: 'article',
      ogImage: ogImage,
      ogUrl: ogUrl,
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


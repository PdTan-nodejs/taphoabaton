const db = require('../models');
const { formatDate, truncate } = require('../utils/helpers');

exports.index = async (req, res) => {
  try {
    // Hero slider - posts with images, top 5
    const allPosts = await db.Post.findAll({
      where: { status: 'published' },
      include: [{
        model: db.Category,
        as: 'category'
      }],
      order: [['createdAt', 'DESC']],
      limit: 10
    });
    const heroSlides = allPosts.filter(post => post.image).slice(0, 5);

    // Featured projects - posts, top 6
    const featuredProjects = await db.Post.findAll({
      where: { status: 'published' },
      include: [{
        model: db.Category,
        as: 'category'
      }],
      order: [['createdAt', 'DESC']],
      limit: 6
    });

    // News/Events - posts, top 6
    const newsEvents = await db.Post.findAll({
      where: { status: 'published' },
      include: [{
        model: db.Category,
        as: 'category'
      }],
      order: [['createdAt', 'DESC']],
      limit: 6
    });

    // Company introduction data (prepared for future DB)
    const companyIntro = {
      title: 'Về chúng tôi',
      content: 'Chúng tôi là một công ty chuyên về phát triển và cung cấp các giải pháp công nghệ hiện đại. Với đội ngũ nhân viên giàu kinh nghiệm và tận tâm, chúng tôi cam kết mang đến những sản phẩm và dịch vụ chất lượng cao, đáp ứng mọi nhu cầu của khách hàng.',
      description: 'Đối tác tin cậy cho mọi giải pháp công nghệ'
    };

    res.render('home/index', {
      title: 'Trang chủ',
      metaDescription: 'Tạp Hóa Bất ổn - Blog website với những bài viết hay và bổ ích về công nghệ, cuộc sống và nhiều chủ đề thú vị khác.',
      metaKeywords: 'blog, tin tức, bài viết, công nghệ, cuộc sống',
      ogTitle: 'Trang chủ - Tạp Hóa Bất ổn',
      ogDescription: 'Tạp Hóa Bất ổn - Blog website với những bài viết hay và bổ ích',
      currentPage: 'home',
      heroSlides: heroSlides.map(slide => ({
        ...slide.toJSON(),
        formattedDate: formatDate(slide.createdAt)
      })),
      companyIntro,
      featuredProjects: featuredProjects.map(project => ({
        ...project.toJSON(),
        formattedDate: formatDate(project.createdAt),
        truncatedExcerpt: truncate(project.excerpt || project.content, 120)
      })),
      newsEvents: newsEvents.map(news => ({
        ...news.toJSON(),
        formattedDate: formatDate(news.createdAt),
        truncatedExcerpt: truncate(news.excerpt || news.content, 150)
      }))
    });
  } catch (error) {
    console.error('Error in homeController.index:', error);
    res.status(500).render('500', { title: 'Lỗi', error });
  }
};


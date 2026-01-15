const db = require('../models');

// Controller cho trang dự án
exports.index = async (req, res) => {
  try {
    const projects = await db.Post.findAll({
      where: {
        status: 'published'
      },
      include: [{
        model: db.Category,
        as: 'category'
      }],
      order: [['createdAt', 'DESC']],
      limit: 12
    });

    res.render('project/index', {
      title: 'Dự án',
      currentPage: 'projects',
      projects: projects
    });
  } catch (error) {
    console.error('Error in projectController.index:', error);
    res.status(500).render('500', { title: '500 - Lỗi server', layout: 'layout' });
  }
};

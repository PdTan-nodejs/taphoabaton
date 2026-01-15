const db = require('../models');

// Controller cho trang giới thiệu
exports.index = async (req, res) => {
  try {
    res.render('about/index', {
      title: 'Giới thiệu',
      currentPage: 'about'
    });
  } catch (error) {
    console.error('Error in aboutController.index:', error);
    res.status(500).render('500', { title: '500 - Lỗi server', layout: 'layout' });
  }
};

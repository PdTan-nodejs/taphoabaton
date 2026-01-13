'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('posts', [
      {
        title: 'Bài viết mẫu số 1',
        slug: 'bai-viet-mau-so-1',
        excerpt: 'Đây là đoạn trích của bài viết mẫu số 1',
        content: '<p>Đây là nội dung đầy đủ của bài viết mẫu số 1. Bạn có thể chỉnh sửa nội dung này trong trang quản trị.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>',
        image: null,
        views: 0,
        status: 'published',
        categoryId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Bài viết mẫu số 2',
        slug: 'bai-viet-mau-so-2',
        excerpt: 'Đây là đoạn trích của bài viết mẫu số 2',
        content: '<p>Đây là nội dung đầy đủ của bài viết mẫu số 2. Bạn có thể chỉnh sửa nội dung này trong trang quản trị.</p><p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>',
        image: null,
        views: 0,
        status: 'published',
        categoryId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('posts', null, {});
  }
};


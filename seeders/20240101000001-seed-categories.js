'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('categories', [
      {
        name: 'Tin tức',
        slug: 'tin-tuc',
        description: 'Các tin tức mới nhất',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Sự kiện',
        slug: 'su-kien',
        description: 'Các sự kiện nổi bật',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Khuyến mãi',
        slug: 'khuyen-mai',
        description: 'Chương trình khuyến mãi',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', null, {});
  }
};


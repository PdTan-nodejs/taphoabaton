require('dotenv').config();
const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');

// Đảm bảo thư mục database tồn tại
const dbDir = path.join(__dirname, '..', 'database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// // Database configuration - SQLite
// const sequelize = new Sequelize({
//   dialect: 'sqlite',
//   storage: path.join(dbDir, 'dev.sqlite'),
//   logging: process.env.NODE_ENV === 'development' ? console.log : false
// });

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(dbDir, 'dev.sqlite'),
  logging: process.env.NODE_ENV === 'development' ? console.log : false
});

// // Production: MySQL (commented, uncomment when deploying to production)
// // const sequelize = new Sequelize(
// //   process.env.DB_NAME,
// //   process.env.DB_USER,
// //   process.env.DB_PASSWORD,
// //   {
// //     host: process.env.DB_HOST,
// //     port: process.env.DB_PORT || 3306,
// //     dialect: 'mysql',
// //     logging: false
// //   }
// // );

module.exports = sequelize;

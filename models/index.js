const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'taphoabaton_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.Category = require('./Category')(sequelize, Sequelize);
db.Post = require('./Post')(sequelize, Sequelize);
db.User = require('./User')(sequelize, Sequelize);

// Define associations
db.Category.hasMany(db.Post, { foreignKey: 'categoryId', as: 'posts' });
db.Post.belongsTo(db.Category, { foreignKey: 'categoryId', as: 'category' });

module.exports = db;


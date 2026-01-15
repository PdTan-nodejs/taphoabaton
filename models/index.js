const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.Category = require('./Category')(sequelize, Sequelize.DataTypes);
db.Post = require('./Post')(sequelize, Sequelize.DataTypes);
db.User = require('./User')(sequelize, Sequelize.DataTypes);
db.Page = require('./Page')(sequelize, Sequelize.DataTypes);
db.Project = require('./Project')(sequelize, Sequelize.DataTypes);

// Define associations
db.Category.hasMany(db.Post, { foreignKey: 'categoryId', as: 'posts' });
db.Post.belongsTo(db.Category, { foreignKey: 'categoryId', as: 'category' });

module.exports = db;

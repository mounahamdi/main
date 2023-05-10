const { DataTypes } = require('sequelize');
const sequelize = require('../ORM/index.js');
const User = require('./user.model.js');
const Product = require('./product.model.js');

const Cart = sequelize.define('cart', {
  cart_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Associations
Cart.belongsTo(User, { foreignKey: 'user_id' });
Cart.belongsTo(Product, { foreignKey: 'product_id' });

module.exports = Cart;

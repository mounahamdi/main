const { DataTypes } = require('sequelize');
const sequelize = require('../ORM/index.js');
const User = require('./user.model.js');

const Order = sequelize.define('order', {
  order_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  order_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  shipping_address: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  shipping_city: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  shipping_state: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  shipping_zip_code: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  shipping_country: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Associations
Order.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Order;

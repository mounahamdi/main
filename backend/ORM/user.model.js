const { DataTypes } = require('sequelize');
const sequelize = require('../ORM/index.js');

const User = sequelize.define('user', {
  user_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  user_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }},
  {
    timestamps: true, // Enable timestamps
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = User;

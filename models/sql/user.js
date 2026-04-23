const { DataTypes } = require('sequelize');
const { sequelize } = require('../../util/database');

const User = sequelize.define('user', {
  name: {
    type: DataTypes.STRING,
    required: true,
  },
  email: {
    type: DataTypes.STRING,
    required: true,
  },
});

module.exports = User;

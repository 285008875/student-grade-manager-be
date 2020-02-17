/* jshint indent: 2 */
const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('./index.js')

Department.init({
  departmentID: {
    type: DataTypes.STRING(12),
    allowNull: false,
    primaryKey: true
  },
  departmentName: {
    type: DataTypes.STRING(10),
    allowNull: true
  }
}, {
  tableName: 'department',
  sequelize,
  modelName: 'Course'
});

module.exports = Course
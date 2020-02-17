/* jshint indent: 2 */
const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('./index.js')
class Major extends Model { }

Major.init({
  majorID: {
    type: DataTypes.STRING(10),
    allowNull: false,
    primaryKey: true
  },
  majorName: {
    type: DataTypes.STRING(14),
    allowNull: true
  },
  majorCategory: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  departmentID: {
    type: DataTypes.STRING(12),
    allowNull: true,
    references: {
      model: 'department',
      key: 'departmentID'
    }
  }
}, {
  tableName: 'major',
  sequelize,
  modelName: 'Grade'
});
module.exports = Grade;

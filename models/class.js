const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('./index.js')
class Class extends Model { }

Class.init({
  classID: {
    type: DataTypes.STRING(10),
    allowNull: false,
    primaryKey: true
  },
  className: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  majorID: {
    type: DataTypes.STRING(10),
    allowNull: true,
    references: {
      model: 'major',
      key: 'majorID'
    }
  },
  monitor: {
    type: DataTypes.STRING(12),
    allowNull: true,
    references: {
      model: 'student',
      key: 'studentID'
    }
  }
}, {
  tableName: 'class',
  sequelize,
  modelName: 'Class'
});
module.exports = Class

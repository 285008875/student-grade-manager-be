/* jshint indent: 2 */
const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('./index.js')
class Grade extends Model { }
Grade.init({
  courseID: {
    type: DataTypes.STRING(10),
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'course',
      key: 'courseID'
    }
  },
  studentID: {
    type: DataTypes.STRING(12),
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'student',
      key: 'studentID'
    }
  },
  grade: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  semester: {
    type: DataTypes.DATEONLY,
    allowNull: true
  }
}, {
  tableName: 'grade',
  sequelize,
  modelName: 'Grade'
});
module.exports = Grade;

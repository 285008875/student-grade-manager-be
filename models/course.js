const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('./index.js')
class Course extends Model { }
Course.init({
  courseID: {
    type: DataTypes.STRING(10),
    allowNull: false,
    primaryKey: true
  },
  courseName: {
    type: DataTypes.STRING(26),
    allowNull: true
  },
  teacherID: {
    type: DataTypes.STRING(12),
    allowNull: true,
    references: {
      model: 'teacher',
      key: 'teacherID'
    }
  }
}, {
  tableName: 'course',
  sequelize,
  modelName: 'Course'
});

module.exports = Course
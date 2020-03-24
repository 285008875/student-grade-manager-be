const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CourseSchema = new Schema({
  _id: {
    type: String,
    required: true,
    index: true,
  },
  courseName: {
    type: String,
    required: true,
  },
  teacherId: {
    type: String,
    ref: 'User',
  }
}, {
  _id: false
})
const Course = mongoose.model('Course', CourseSchema)
module.exports = Course;
























// // const {
// //   Sequelize,
// //   DataTypes,
// //   Model
// // } = require('sequelize');
// // const sequelize = require('./index.js')
// // const Teacher = require('./teacher.js')
// class Course extends Model {}
// Course.init({
//   courseID: {
//     type: String,
//     required: true,
//     index: true,
//   },
//   courseName: {
//     type: DataTypes.STRING(26),
//     allowNull: true
//   },
//   teacherID: {
//     type: DataTypes.STRING(12),
//     allowNull: true,
//     references: {
//       model: 'teacher',
//       key: 'teacherID'
//     }
//   }
// }, {
//   tableName: 'course',
//   sequelize,
//   modelName: 'Course'
// });
// Course.belongsTo(Teacher, {
//   foreignKey: 'teacherID',
// })
// module.exports = Course
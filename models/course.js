const mongoose = require('mongoose');
const Class = require('./class')
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
  createTime:{
    type: String, 
    default: new Date().getMonth() > 6 ? new Date().getFullYear() + '-' + 9 : new Date().getFullYear() + '-' + 3
  },
}, {
  _id: false
})

CourseSchema.index({ _id: 1, classId: 1 });
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
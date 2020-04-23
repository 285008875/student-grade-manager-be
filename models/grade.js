const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const GradeSchema = new Schema({
  _id: {
    type: String,
    required: true,
    index: true,

  },
  studentId: {
    type: String,
    required: true,
    ref:"User",
    index: true,
  },
  courseId: {
    type: String,
    // required: true,
    ref: "Course",
    index: true,
  },
  score: {
    type: Number,
  },
  semester:{
    type:String,
    default: new Date().getMonth() > 6 ? new Date().getFullYear() + '-' + 9 : new Date().getFullYear()+'-'+3
  }
}, {
  _id: false
})
const Grade = mongoose.model('Grade', GradeSchema)
module.exports = Grade;
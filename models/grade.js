const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ClassSchema = new Schema({
  _id: {
    type: String,
    // required: true,
    index: true,

  },
  studentId: {
    type: String,
    required: true,
    ref:"User"
  },
  courseId: {
    type: String,
    required: true,
    ref: "Course"
  },
  score: {
    type: Number,
  },
  semester:{
    type:String,
    default: new Date().getFullYear() + '-' + new Date().getMonth()>6 ?9:3
  }
}, {
  _id: false
})
const Class = mongoose.model('Class', ClassSchema)
module.exports = Class;
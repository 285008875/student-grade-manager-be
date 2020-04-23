// const { Sequelize, DataTypes, Model } = require('sequelize');
// const sequelize = require('./index.js')
// class Class extends Model { }
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ClassSchema = new Schema({
  _id: {
    type: Number,
    // required: true,
    index: true,

  },
  className: {
    type: String,
    // required: true,
  },
  marjorName: {
    type: String,
    // required: true,
  },
  marjorCategory: {
    type: String,
    // required: true,
  },

  departmentName: {
    type: String,
    required: true,
  },
  monitor: {
    type: String,
    ref: 'Student',
  }
}, {
  _id: false
})
const Class = mongoose.model('Class', ClassSchema)
module.exports = Class;
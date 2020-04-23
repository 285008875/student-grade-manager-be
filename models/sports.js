// const { Sequelize, DataTypes, Model } = require('sequelize');
// const sequelize = require('./index.js')
// class Class extends Model { }
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SportsSchema = new Schema({
    _id: {
        type: String,
        required: true,
        index: true,
        unique: true 

    },
    studentId: {
        type: String,
        required: true,
        // index: true,
        ref: 'User',
    },
    score1: {
        type: Number,
        // required: true,
        default: 0,
    },
    score2: {
        type: Number,
        // required: true,
        default: 0,
    },
    score3: {
        type: Number,
        // required: true,
        default: 0,
    },
    score4: {
        type: Number,
        // required: true,
        default: 0,
    },
    time: {
        type: String,
        required: true,
        default: new Date().getMonth() > 6 ? new Date().getFullYear() + '-' + 9 : new Date().getFullYear() + '-' + 3
    },

}, {
    _id: false
})
const Sports = mongoose.model('Sports', SportsSchema)
module.exports = Sports;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const MoralEduSchema = new Schema({
    _id: {
        type: String,
        required: true,
        index: true,
        unique: true

    },
    studentId: {
        type: String,
        required: true,
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
const MoralEdu = mongoose.model('MoralEdu', MoralEduSchema)
module.exports = MoralEdu;
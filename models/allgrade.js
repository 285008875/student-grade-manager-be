
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AllGradeSchema = new Schema({
    _id: {
        type: String,
        required: true,
        ref: 'User',
        index:true
    },
    intellectualSum: {
        type: Number,
        // required: true,
        default: 0,
    },
    intellectualAvg: {
        type: Number,
        // required: true,
        default: 0,
    },
    moralEduSum: {
        type: Number,
        // required: true,
        default: 0,
    },
    moralEduAvg: {
        type: Number,
        // required: true,
        default: 0,
    },
    SportSum: {
        type: Number,
        // required: true,
        default: 0,
    },
    SportAvg: {
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
const AllGrade = mongoose.model('AllGrade', AllGradeSchema)
module.exports = AllGrade;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const LogCountsSchema = new Schema({
    time: {
        type: String,
        required: true,
        default:  new Date().getFullYear() + '-' + new Date().getMonth()+1,
        index:true
    },
    count: {
        type: Number,
        default: 0
    },
}, {
    _id: false
})
const LogCounts = mongoose.model('LogCount', LogCountsSchema)
module.exports = LogCounts;












const mongoose = require('mongoose');
const options = {
    useNewUrlParser: true,
    autoIndex: false,
    poolSize: 10,
    useUnifiedTopology: true,
    bufferMaxEntries: 0
};
mongoose.set('useFindAndModify', false)

mongoose.connect('mongodb://localhost:27017/wjdb', options)
mongoose.connection.on("connected", () => {
    console.log("mongodb数据库连接成功")
});
mongoose.connection.on("error", (error) => {
    console.log("mongodb数据库连接失败", error)
});
const user = require('./user')
const clazz = require('./class')
const course = require('./course')
const privilege = require('./privilege')
require('./moraledu')
require('./role')
const allgrade = require('./allgrade')
const sports = require('./sports')
const grade = require('./grade')
const logcount = require('./logcount')

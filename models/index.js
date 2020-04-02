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
    .then(() => console.log('mongodb连接成功........'))
    .catch(err => console.log(err, 'mongodb连接失败........'));

const user = require('./user')
const clazz = require('./class')
const course = require('./course')
const privilege = require('./privilege')
const role = require('./role')
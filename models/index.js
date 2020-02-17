const Sequelize = require('sequelize');

const sequelize = new Sequelize('wjdb', 'root', "", {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306,
    // operatorsAliases: false,
    define: {
        timestamps: false
    },
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});
// sequelize.sync()
sequelize
    .authenticate()
    .then(() => {
        // console.lo
        console.log('MYSQL 连接成功......');
    })
    .catch(err => {
        console.error('链接失败:', err);
    });

// sequelize.sync()
module.exports = sequelize




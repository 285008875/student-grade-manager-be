
const Router = require('koa-router')
const loginRouter = new Router();
const { loginController } = require('../controllers/login')
loginRouter.post("/login", loginController)

module.exports = loginRouter
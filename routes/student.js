const Router = require('koa-router');
const sequelize = require("../models/index");
const studentRouter = new Router({ prefix: '/student' });
const { verifyToken, decodeToken } = require('../auth/auth')
studentRouter.use(verifyToken);

studentRouter.post("/grade", async ctx => {
    console.log("decodeToken", decodeToken(ctx))
    // decodeToken(ctx)
    // ctx.body = 'studentRouter Ok'
    ctx.body = { "kdfhjds": 565656556 }
})
studentRouter.get("/studentmanage", async ctx => {
    
    console.log(111111111111111)
    // ctx.body = 'studentRouter Ok'
})
module.exports = studentRouter;
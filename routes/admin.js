
const Router = require('koa-router')
const adminRouter = new Router({ prefix: '/admin' });

adminRouter.get("/", async ctx => {
    ctx.body = 'adminRouter Ok'
})




module.exports = adminRouter
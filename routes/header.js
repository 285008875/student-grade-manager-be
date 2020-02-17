const Router = require('koa-router');

const headerRouter = new Router({ prefix: '/header' });

headerRouter.get("/", async ctx => {
    ctx.body = 'adminRouter Ok'
})

module.exports = headerRouter
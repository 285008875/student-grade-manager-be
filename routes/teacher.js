const Router = require('koa-router');

const teacherRouter = new Router({ prefix: '/teacher' });

teacherRouter.get("/", async ctx => {
    ctx.body = 'teacherRouter Ok'
})
module.exports = teacherRouter
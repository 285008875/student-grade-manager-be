
const Router = require('koa-router')
const AdminControllers = require('../controllers/admin')

const adminRouter = new Router({ prefix: '/admin' });
const { verifyToken, decodeToken } = require('../auth/auth')
adminRouter.use(verifyToken);

adminRouter.get("/schoolcircle", async ctx => {
    console.log("/admin/schoolcircle")
})
adminRouter.get("/monitor", async ctx => {
    console.log("/admin/monitor")
})
adminRouter.get("/studentmanage", async ctx => {
    console.log("/admin/studentmanage")
})
adminRouter.get("/teachermanage", async ctx => {
    console.log("/admin/teachermanage")
})
adminRouter.get("/grademanage", async ctx => {
    console.log("/admin/grademanage")
})
adminRouter.get("/coursemanage", async ctx => {
    console.log("/admin/coursemanage")
})
adminRouter.get("/classmanage", AdminControllers.getClass)
adminRouter.post("/majormanage", async ctx => {
})
adminRouter.get("/impower", async ctx => {
    console.log("/admin/impower")
})
adminRouter.get("/setting", async ctx => {
    console.log("/admin/setting")
})


module.exports = adminRouter
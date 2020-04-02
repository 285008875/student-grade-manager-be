
const Router = require('koa-router')
const AdminControllers = require('../controllers/admin')
const { verifyToken, decodeToken } = require('../auth/auth')

const adminRouter = new Router({ prefix: '/admin' });
adminRouter.use(verifyToken);

adminRouter.get("/schoolcircle", async ctx => {
    console.log("/admin/schoolcircle")
})
adminRouter.get("/monitor", async ctx => {
    console.log("/admin/monitor")
})

adminRouter.get("/studentmanage", AdminControllers.getStudent)
adminRouter.post("/studentmanage", AdminControllers.updateStudent)
adminRouter.post("/delstudentmanage", AdminControllers.deleteStudent)
adminRouter.post("/addstudentmanage", AdminControllers.addStudent)
adminRouter.post("/fileupload", AdminControllers.handleFileUpload)
adminRouter.get("/filedownload", AdminControllers.handleFileDownload)

adminRouter.get("/teachermanage", AdminControllers.getTeacher)
adminRouter.post("/teachermanage", AdminControllers.updateTeacher)
adminRouter.post("/delteachermanage", AdminControllers.deteleTeacher)
adminRouter.get("/tfiledownload", AdminControllers.handleFileTDownload)



adminRouter.get("/coursemanage", AdminControllers.getCourse)
adminRouter.post("/updatecoursemanage", AdminControllers.updateCourse)
adminRouter.post("/delcoursemanage", AdminControllers.deleteCourse)
adminRouter.post("/addcoursemanage", AdminControllers.addCourse)

adminRouter.get("/classmanage", AdminControllers.getClass)
adminRouter.post("/classmanage", AdminControllers.updateClass)
adminRouter.post("/delclassmanage", AdminControllers.deleteClass)
adminRouter.put("/classmanage", AdminControllers.addClass)

// adminRouter.get("/majormanage",AdminControllers.updateClass)
adminRouter.get("/impower", async ctx => {
    console.log("/admin/impower")
})
adminRouter.get("/setting", async ctx => {
    console.log("/admin/setting")
})


module.exports = adminRouter
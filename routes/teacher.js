const Router = require('koa-router');
const TeacherControllers = require('../controllers/teacher')
const { verifyToken, decodeToken } = require('../auth/auth')
const teacherRouter = new Router({ prefix: '/teacher' });


teacherRouter.use(verifyToken);
teacherRouter.get("/impower", TeacherControllers.getStudentInClass)
teacherRouter.post("/modifymonitor", TeacherControllers.modifyStudentOfRole)
teacherRouter.post("/setmonitor", TeacherControllers.setStudentOfRole)


teacherRouter.get("/grademanage", TeacherControllers.getStudentGradeInClass)
teacherRouter.post("/updategrademanage", TeacherControllers.updeteGrade)
teacherRouter.post("/delgrademanage", TeacherControllers.deleteGrade)
teacherRouter.post("/fileupload", TeacherControllers.handleFileUpload)


teacherRouter.get("/allgrade", TeacherControllers.getAllgrade)


teacherRouter.get("/sports", TeacherControllers.getSports)
teacherRouter.post("/updatesports", TeacherControllers.updateSports)
teacherRouter.post("/delsports", TeacherControllers.delSports)
teacherRouter.post("/addsports", TeacherControllers.addSports)
// teacherRouter.get("/classname", TeacherControllers.getClassName)
teacherRouter.get("/moraledu", TeacherControllers.getMoralEdu)
teacherRouter.post("/updatemoraledu", TeacherControllers.updateMoralEdu)
teacherRouter.post("/delmoraledu", TeacherControllers.delMoralEdu)
teacherRouter.post("/addmoraledu", TeacherControllers.addMoralEdu)

module.exports = teacherRouter
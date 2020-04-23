const Router = require('koa-router');
const { verifyToken } = require('../auth/auth')
const monitorControllers = require('../controllers/monitor')
const monitorRouter = new Router({ prefix: '/monitor' });

monitorRouter.use(verifyToken);

monitorRouter.get("/grademanage", monitorControllers.getStudentGradeInClass)

monitorRouter.post("/updategrademanage", monitorControllers.updeteGrade)
monitorRouter.post("/delgrademanage", monitorControllers.deleteGrade)
monitorRouter.post("/fileupload", monitorControllers.handleFileUpload)


monitorRouter.get("/allgrade", monitorControllers.getAllgrade)


monitorRouter.get("/sports", monitorControllers.getSports)
monitorRouter.post("/updatesports", monitorControllers.updateSports)
monitorRouter.post("/delsports", monitorControllers.delSports)
monitorRouter.post("/addsports", monitorControllers.addSports)

monitorRouter.get("/moraledu", monitorControllers.getMoralEdu)
monitorRouter.post("/updatemoraledu", monitorControllers.updateMoralEdu)
monitorRouter.post("/delmoraledu", monitorControllers.delMoralEdu)
monitorRouter.post("/addmoraledu", monitorControllers.addMoralEdu)

module.exports = monitorRouter
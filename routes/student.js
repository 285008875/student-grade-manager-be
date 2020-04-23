const Router = require('koa-router');
const StudentControllers = require('../controllers/student')
const studentRouter = new Router({ prefix: '/student' });
const { verifyToken } = require('../auth/auth')

studentRouter.use(verifyToken);
studentRouter.get("/classname", StudentControllers.getClassName)
studentRouter.get("/sports", StudentControllers.getSports)
studentRouter.get("/moraledu", StudentControllers.getMoralEdu)
studentRouter.get("/grademanage", StudentControllers.getStudentGradeInClass)
// studentRouter.get("/grademanage")
studentRouter.get("/allgrade", StudentControllers.getAllgrade)
// studentRouter.get("/setting")
module.exports = studentRouter;

const combineRouters = require('koa-combine-routers')
const studentRouter = require("./student")
const teacherRouter = require("./teacher")
const adminRouter = require("./admin")
const headerRouter = require("./header")

const router = combineRouters([
  studentRouter,
  teacherRouter,
  adminRouter,
  headerRouter
])

module.exports = router
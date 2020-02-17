const Koa = require('koa')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const helmet = require('koa-helmet');
const JWT = require('koa-jwt')
const cors = require('@koa/cors');
const compress = require('koa-compress')
const SECRET = require('./config/config.js').secret;
const { verifyToken } = require('./auth/auth.js');
const errorHandle = require('./middlewares/errorHandle')
const adminRouter = require('./routes/admin')
const headerRouter = require('./routes/header')
const studentRouter = require('./routes/student')
const teacherRouter = require('./routes/teacher')
const loginRouter = require('./routes/login.js')

const app = new Koa()
// error handler
onerror(app)
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms - ${ctx.ip} - ${ctx.response.status} `)
})

app.use(errorHandle)




app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(cors());
app.use(helmet());

app.use(compress({
  filter: function (content_type) {
    return /text/i.test(content_type)
  },
  threshold: 2048,
  flush: require('zlib').Z_SYNC_FLUSH
}))
//使用
app.use(async (ctx, next) => {
  ctx.compress = true; //是否压缩数据
  await next();
});


// logger

app.use(loginRouter.routes(), loginRouter.allowedMethods())
app.use(studentRouter.routes(), studentRouter.allowedMethods())
app.use(teacherRouter.routes(), teacherRouter.allowedMethods())
app.use(headerRouter.routes(), headerRouter.allowedMethods())
app.use(adminRouter.routes(), adminRouter.allowedMethods())

app.use(JWT({ SECRET }).unless({
  path: [/^\/login/],
  passthrough: true
}))

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app

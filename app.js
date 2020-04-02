const Koa = require('koa')
const json = require('koa-json')
const onerror = require('koa-onerror')
const koaBody = require('koa-body')
// const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger')
const helmet = require('koa-helmet');
const JWT = require('koa-jwt')
const path = require('path')
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
// app.use(bodyparser()); 
app.use(koaBody({
  multipart: true, // 支持文件上传
  encoding: 'utf-8',
  json: true,
  formidable: {
    uploadDir: path.join(__dirname, '/upload/'), // 设置文件上传目录
    keepExtensions: true,    // 保持文件的后缀
    maxFieldsSize: 10 * 1024 * 1024, // 文件上传大小
    onFileBegin: (name, file) => { // 文件上传前的设置
      // console.log(`name: ${name}`);
      // console.log(file);
    },
  }
}));
app.use(json({ pretty: true, param: 'pretty'}))
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
// app.use(async (ctx, next) => {
//   // ctx.compress = true; //是否压缩数据
//   await next();
// });


// logger

app.use(loginRouter.routes(), loginRouter.allowedMethods())
app.use(studentRouter.routes(), studentRouter.allowedMethods())
app.use(teacherRouter.routes(), teacherRouter.allowedMethods())
app.use(headerRouter.routes(), headerRouter.allowedMethods())
app.use(adminRouter.routes(), adminRouter.allowedMethods())

app.use(JWT({ SECRET }).unless({
  path: [/^\/login/],// /^\/admin\/fileupload/, /^\/admin\/filedownload/
  passthrough: true
}))

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app

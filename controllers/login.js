const User = require('../models/user');
const Course = require('../models/course')
const { setToken } = require('../auth/auth.js')


loginController = async (ctx) => {
    let reqUser = ctx.request.body
    // const clazz = new Clazz({ _id: "20175000", className: "5dsdsfds", marjorName: "5555555", marjorCategory: "5454445", departmentName: "555555", monitor: "55451dssf" })
    // clazz.save((err) => {
    //     if (err) {
    //         console.log(err)
    //     }
    //     console.log(44444)
    // })
    // const a = new Course({ _id: "1234565265", courseName: "数学", createTime: new Date().getFullYear() + '-' + new Date().getMonth(), classId:'2351515'})
    // a.save(function (err,data) {
    //     console.log(err,data)
    // })
    if (reqUser && reqUser.username && reqUser.password) {
        try {
            let user = await User.verifyUser(reqUser)
            if (user != false) {
                let {
                    password,
                    roleId,
                    ...rest
                } = user
                const { roleName } = roleId
                return ctx.body = {
                    token: setToken({
                        roleName,
                        ...rest,
                    }),
                    data: {
                        roleId,
                        ...rest
                    },
                    code: 200,
                    succeed: 1,
                    msg: "登陆成功"
                }

            } else {
                return ctx.body = {
                    code: 200,
                    succeed: 0,
                    msg: "账号密码不匹配"
                }

            }

        } catch (error) {
            console.log(error)
            return ctx.body = {
                code: 500,
                succeed: 0,
                msg: "服务器错误"
            }
        }
    }
}


module.exports = {
    loginController
}
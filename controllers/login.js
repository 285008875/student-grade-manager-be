const User = require('../models/user');
// const Clazz = require('../models/class.js')
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
            return ctx.body = {
                code: 500,
                succeed: 0,
                msg: "服务器错误"
            }
            console.log(error)
        }
    }
}


module.exports = {
    loginController
}
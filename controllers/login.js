const User = require('../models/user');
const LogCounts= require('../models/logcount')
const { setToken } = require('../auth/auth.js')


loginController = async (ctx) => {
    let reqUser = ctx.request.body
    // console.log(reqUser)
    if (reqUser && reqUser.username && reqUser.password) {
        try {
            let user = await User.verifyUser(reqUser)
            if (user != false) {
                let {
                    password,
                    roleId,
                    ...rest
                } = user
                // console.log(user)
                const { roleName } = roleId
                await LogCounts.updateOne({ time: new Date().getFullYear() + '-' + (new Date().getMonth() + 1)},{$inc:{count:1}} ,{ upsert: true} )
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
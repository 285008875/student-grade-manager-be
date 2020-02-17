
const Student = require('../models/student');
const Teacher = require('../models/teacher');
const Role = require('../models/role.js')
const Privilege = require('../models/privilege.js')
const { genPassword, comparePassword, setToken } = require('../auth/auth.js')
loginController = async (ctx) => {
    let user = ctx.request.body
    // console.log(user)
    if (user && user.username && user.password) {
        try {
            let student = await Student.findOne({
                where: {
                    studentID: user.username
                },
                attributes: { exclude: ['email', 'tel', 'roleID'] },
                include: [{
                    model: Role,
                    attributes: { exclude: ['roleID',] },
                    include: [{
                        attributes: { exclude: ['roleID',] },
                        model: Privilege,

                    }]
                }]
            })
            let teacher = await Teacher.findOne({
                where: {
                    teacherID: user.username
                },
                attributes: { exclude: ['tel', 'roleID'] },
                include: [{
                    model: Role,
                    attributes: { exclude: ['roleID',] },
                    include: [{
                        attributes: { exclude: ['roleID',] },
                        model: Privilege,

                    }]
                }]
            })
            if (student || teacher) {

                if (student) {
                    student = JSON.parse(JSON.stringify(student))
                    console.log(JSON.stringify(student))
                    if (comparePassword(user.password, student.password)) {
                        delete student.password
                        console.log("setToken(student)", setToken(student))
                        return ctx.body = {
                            token: setToken(student),
                            data: student,
                            code: 200,
                            msg: "登陆成功"

                        }

                        // ctx.redirect('/student');
                        return;
                    } else {
                        return ctx.body = { code: 400, msg: '密码不匹配' }

                    }

                } else {

                    teacher = JSON.parse(JSON.stringify(teacher))
                    console.log(teacher, comparePassword(user.password, teacher.password))
                    if (comparePassword(user.password, teacher.password)) {
                        delete teacher.password
                        return ctx.body = {
                            token: setToken(teacher),
                            data: teacher,
                            code: 200,
                            msg: "登陆成功"
                        }

                        return;
                    } else {
                        return ctx.body = { code: 400, msg: '密码不匹配' }

                    }
                }

            } else {
                return ctx.body = { code: 400, msg: '账号不存在' }

            }
        } catch (error) {
            return ctx.bodye = { code: 500, msg: '服务器错误' }

        }


    }
}


module.exports = {
    loginController
}
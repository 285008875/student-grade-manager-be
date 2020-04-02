// const xlsx = require('node-xlsx').default
const xlso = require('xlso');
const xlsx = require('xlsx');
const json2xlsx = require('json2xlsx')
const send = require('koa-send')
const Path = require('path')
const fs = require('fs-extra')
const User = require('../models/user');
const Clazz = require('../models/class.js')
const Course = require('../models/course')
const { decodeToken} = require('../auth/auth')
class AdminControllers {
    static async getStudent(ctx){
        const user = decodeToken(ctx)
        if (user.roleName ==='admin') {
            //管理员身份
            const result = await User.find().select('-password -classId -marjorId -roleId').or([{roleId:'s123'},{roleId:'m123'}])
            return ctx.body = {
                result,
                code: 200,
                succeed: 1
            }
        }
        
    }
    static async deleteStudent(ctx) {
        try {
            const student = ctx.request.body
            // console.log("student",student)
            // const { _id, ...rest } = student
            let result = await User.deleteOne(student)
            console.log(result)
            if (result != null && result.ok === 1) {
                return ctx.body = {
                    result: student,
                    code: 200,
                    succeed: 1,
                }
            } else {
                return ctx.body = {
                    code: 200,
                    succeed: 0,
                }
            }

        } catch (error) {
            console.log(error)
        }

    }
    static async updateStudent(ctx) {
        try {
            const student = ctx.request.body
            // console.log(student)
            const { _id, ...rest } = student
            let result =  await User.findByIdAndUpdate(_id, rest)
            // console.log(result)
            if (result != null) {
                return ctx.body = {
                    result: student,
                    code: 200,
                    succeed: 1

                }
            } else {
                return ctx.body = {
                    code: 200,
                    succeed: 0,
                    msg: "学生不存在或修改失败"

                }
            }

        } catch (error) {
            console.log(error)
        }
    }
    static async handleFileUpload(ctx){
        try {
            // console.log(ctx.request)
            const {path,type} = ctx.request.files.studentFile
            console.log(path)
            if (type ==='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                const workbook = xlsx.readFile(path);
                // parse the workbook to a js array
                const rows = xlso.parseWorkbook(workbook, 0, 0);
                let result = await User.insertMany(rows)
                console.log(result)
                let filePath = Path.join(__dirname, '../upload/')
                
                await fs.emptyDir(filePath)
                if (result.length!==0) {
                    return ctx.body = {
                        code: 200,
                        succeed: 1,
                        result: result
                    }
                }
                
            }
        } catch (error) {
            console.log(error,'文件上传错误')
        }
    }
    static async handleFileDownload(ctx) {
        
        const  filePath = Path.join(__dirname,'../upload/')
        console.log(filePath)
        await fs.emptyDir(filePath,(err)=>{
            
                console.log("err",err)
            

        })
        const result = await User.find().select('-password -roleId').or([{ roleId: 's123' }, { roleId: 'm123' }]).lean(true)
        // console.log(result)
        await json2xlsx.write(filePath+'/test.xlsx','worksheet1', result)
        ctx.attachment('test.xlsx');
        await send(ctx, './upload/test.xlsx')
        // const reader = fs.createReadStream();
    }
    static async addStudent(ctx){
        try {
            const student = ctx.request.body
            console.log(student)
            let result = await User.create(student);
            if (result && result != null) {
                return ctx.body = {
                    code: 200,
                    succeed: 1,
                    result: student
                }
            }else{
                return ctx.body = {
                    code: 200,
                    succeed: 0,
                }
            }

        } catch (error) {
            console.log(error)
        }
    }
    static async getClass(ctx) {
        try {
            const result = await Clazz.find();
            return ctx.body = {
                result,
                code: 200,
                succeed: 1

            }
        } catch (err) {
            return ctx.body = {
                code: 500,
                succeed: 0

            }
        }

    };
    static async updateClass(ctx) {
        try {
            const clazz =  ctx.request.body
            const {_id,...rest} = clazz
            let result = await Clazz.findByIdAndUpdate(_id, rest)

            if (result != null){
                return ctx.body = {
                    result:clazz,
                    code: 200,
                    succeed: 1

                }
            }else{
                return ctx.body = {
                    code: 200,
                    succeed: 0,
                    msg:"班级不存在或修改失败"

                }
            }
            
        } catch (error) {
            console.log(error)
        }
    }
    static async addClass(ctx) {
        try {
            const clazz = ctx.request.body
     
            let result = await Clazz.create(clazz);
            if (result&&result!=null){
                return ctx.body = {
                    code: 200,
                    succeed: 1,
                    result: result
                }
            }
            
        } catch (error) {
            console.log(error)
        }
    }
    static async deleteClass(ctx) {
        try {
            const clazz = ctx.request.body

            const { _id, ...rest } = clazz
            let result = await Clazz.deleteOne(clazz)

            if (result != null && result.ok === 1) {
                return ctx.body = {
                    result: clazz,
                    code: 200,
                    succeed: 1,
                }
            } else {
                return ctx.body = {
                    code: 200,
                    succeed: 0,
                }
            }

        } catch (error) {
            console.log(error)
        }
    }
    static async getTeacher(ctx) {
        const result = await User.find({roleId: 't123'})
        .select('-password  -marjorId -roleId')
        .populate('classId',{
            className:1
        })
        return ctx.body = {
            result,
            code: 200,
            succeed: 1
        }
    }
    static async updateTeacher(ctx) {
        try {
            const teacher = ctx.request.body
            const { _id, ...rest } = teacher
            let result = await User.findByIdAndUpdate(_id, rest)
            // console.log(result)
            if (result != null) {
                return ctx.body = {
                    result: teacher,
                    code: 200,
                    succeed: 1

                }
            } else {
                return ctx.body = {
                    code: 200,
                    succeed: 0,
                    msg: "学生不存在或修改失败"

                }
            }

        } catch (error) {
            console.log(error)
        }
    }
    static async deteleTeacher(ctx) {
        try {
            const teacher = ctx.request.body
            console.log("teacher",teacher)
            const { _id, ...rest } = teacher
            let result = await User.deleteOne({ _id: _id})
            console.log(result)
            if (result != null && result.ok === 1) {
                return ctx.body = {
                    // result: teacher,
                    code: 200,
                    succeed: 1,
                }
            } else {
                return ctx.body = {
                    code: 200,
                    succeed: 0,
                }
            }

        } catch (error) {
            console.log(error)
        }

    }
    static async handleFileTDownload(ctx) {

        const filePath = Path.join(__dirname, '../upload/')
        console.log(filePath)
        await fs.emptyDir(filePath)
        const result = await User.find({ roleId: 't123' }).select('-password -roleId').lean(true)
        // console.log(result)
        await json2xlsx.write(filePath + '/teacher.xlsx','worksheet1' ,result)
        ctx.attachment('teacher.xlsx');
        await send(ctx, "./upload/teacher.xlsx")
 
    }
    static async getCourse (ctx){
        try {
            const result = await Course.find();
            return ctx.body = {
                result,
                code: 200,
                succeed: 1

            }
        } catch (err) {
            return ctx.body = {
                code: 500,
                succeed: 0

            }
        }
    }
    static async updateCourse(ctx) { 
        try {
            const course = ctx.request.body
            const { _id, ...rest } = course
            let result = await Course.findByIdAndUpdate(_id, rest)
            // console.log(result)
            if (result != null) {
                return ctx.body = {
                    result: course,
                    code: 200,
                    succeed: 1

                }
            } else {
                return ctx.body = {
                    code: 200,
                    succeed: 0,
                    msg: "学生不存在或修改失败"

                }
            }

        } catch (error) {
            return ctx.body = {
                code: 200,
                succeed: 0,
                msg: "学生不存在或修改失败",
                error

            }
        }
    }
    static async deleteCourse(ctx) {
        try {
            const course = ctx.request.body
            console.log("course", course)
            const { _id, ...rest } = course
            let result = await Course.deleteOne({ _id: _id })
            console.log(result)
            if (result != null && result.ok === 1) {
                return ctx.body = {
                    // result: course,
                    code: 200,
                    succeed: 1,
                }
            } else {
                return ctx.body = {
                    code: 200,
                    succeed: 0,
                }
            }

        } catch (error) {
            console.log(error)
        }
     }
    static async addCourse(ctx) {
        try {
            const course = ctx.request.body

            let result = await Course.create(course);
            if (result && result != null) {
                return ctx.body = {
                    code: 200,
                    succeed: 1,
                    result: result
                }
            }

        } catch (error) {
            console.log(error)
        }
     }

}

module.exports = AdminControllers
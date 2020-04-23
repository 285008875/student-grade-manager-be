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
const Grade = require('../models/grade')
const LogCounts = require('../models/logcount')
const AllGrade = require('../models/allgrade')
const MoralEdu = require('../models/moraledu') 
const Sports = require('../models/sports')
const { decodeToken} = require('../auth/auth')
class AdminControllers {

    static async getLogTimes(ctx){
        try {
            const result = await LogCounts.find({}).select('-_id time count').lean()
            console.log(result)
            if (result.length>0) {
                return ctx.body = {
                    result:result,
                    code: 200,
                    succeed: 1
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
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
            // console.log(path)
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
    static async getGrade(ctx){
        try {
            const grade = await Grade.find()
                .populate('studentId', {
                    _id: 1,
                    name: 1
                })
                .populate('courseId', {
                    _id: 1,
                    courseName: 1
                }).lean()
            return ctx.body = {
                code: 200,
                succeed: 1,
                result: grade
            }
            
        } catch (error) {
            return ctx.body = {
                code: 200,
                succeed: 0,
                result: error
            }
        }

    }
    static async updeteGrade(ctx){
        try {
            const grade = ctx.request.body
            const { _id, ...rest } = grade
            let result = await Grade.findByIdAndUpdate(_id, rest, { new: true }).select('-courseId -studentId')
            if (result != null) {
                return ctx.body = {
                    result: result,
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
    static async deleteGrade(ctx){
        try {
            const grade = ctx.request.body

            const { _id, ...rest } = grade
   
            let result = await Grade.findByIdAndDelete( _id)
    
            if (result != null ) {
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
    static async getAllgrade(ctx){
        const grade = await Grade.aggregate([
            {
                $project: { studentId: 1, score:1,semester:1}
            },
            {
                $group: { _id: "$studentId", intellectualSum: { $sum: "$score" }, intellectualAvg: { $avg: "$score" }}
            },
            {
                $sort: {
                    _id: 1
                }
            }
        ])
        .then((docs)=>{
            docs.map(async (doc)=>{
                const {_id,...rest} = doc;
                await AllGrade.updateOne({ _id: _id }, rest, { upsert :true})
            })
        })

        
        
        const moralEdu = await MoralEdu.aggregate([
            {
                $project: { studentId: 1,time:1, "moralEduSum": { "$add": ["$score1", "$score2", "$score3", "$score4"] }, "moralEduAvg": { "$avg": ["$score1", "$score2", "$score3", "$score4"] } }
            },
            {
                "$sort": { "studentId": 1 }
            } 
        ])
        .then((docs) => {
            const result = [];
            docs.map(async (doc) => {
                doc._id = doc.studentId
                delete doc.studentId
                const { _id, ...rest } = doc;
                await AllGrade.updateOne({ _id: _id }, rest, { upsert: true })
            })
            return result
        })
        
        const sports = await Sports.aggregate([
            {
                $project: { studentId: 1, time: 1, "SportSum": { "$add": ["$score1", "$score2", "$score3", "$score4"] }, "SportAvg": { "$avg": ["$score1", "$score2", "$score3", "$score4"] } }
            },
            {
                "$sort": { "studentId": 1 }
            }
        ])
        .then((docs) => {
            const result = [];
            docs.map(async (doc) => {
                doc._id = doc.studentId
                delete doc.studentId
                const { _id, ...rest } = doc;
                await AllGrade.updateOne({ _id: _id }, rest, { upsert: true })
            })
            return result
        })
        
        const result = await AllGrade.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $project: {

                    _id:1,
                    'user.name':1,
                    intellectualAvg:1,
                    intellectualSum:1,
                    moralEduAvg:1,
                    moralEduSum:1,
                    SportAvg:1,
                    SportSum:1,
                    time:1,
                    "Sum": { 
                        "$add": ["$intellectualSum", "$moralEduSum", "$SportSum"] 
                    }, 
                    "Avg": { 
                        "$avg": ["$intellectualAvg", "$moralEduAvg", "$SportAvg"] 
                    }

                },
            
            },
   
            {
                $sort: {
                    Sum: 1
                }
            },
        ])
        if (result.length>0) {
            return ctx.body = {
                result: result,
                code: 200,
                succeed: 1,
            }
        }else{
            return ctx.body = {
                
                code: 200,
                succeed: 0,
            }
        }

        
    }
    static async getSports(ctx){
        try {
            const sports = await Sports.aggregate([
                
                {
                    $lookup: {
                        from: 'users',
                        localField: 'studentId',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $project: { _id: 1, 'user.name': 1,studentId: 1, score1: 1, score2: 2, score3: 3, score4: 4,time: 1, "sum": { "$add": ["$score1", "$score2", "$score3", "$score4"] } }
                },
                {
                    "$sort": { "_id": 1 }
                }
            ])
           
            // console.log(sports)
            if (sports.length>0) {
                return ctx.body = {
                    result: sports,
                    code: 200,
                    succeed: 1,
                }
            }
        } catch (error) {
            
        }
    }
    static async updateSports(ctx){
        try {
            
            const  sports  = ctx.request.body
            const {studentId ,...rest} = sports 
            let result = await Sports.findOneAndUpdate({ studentId: studentId }, rest, { new:true}).lean()
            result.sum = result.score1 + result.score2 + result.score3+result.score4
            console.log(result)
            if (result!=null) {
                return ctx.body = {
                    result: result,
                    code: 200,
                    succeed: 1,
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
    static async delSports(ctx) {
        const  sports  = ctx.request.body
        console.log(sports)
        const result = await Sports.deleteOne(sports)
        console.log(result)
        if (result != null && result.ok === 1 && result.deletedCount === 1) {
            return ctx.body = {
                result: sports,
                code: 200,
                succeed: 1,
            }
        } else {
            return ctx.body = {
                code: 200,
                succeed: 0,
            }
        }
        
    }

    static async addSports(ctx) {
        try {
            const  sports  = ctx.request.body
            
            let result = await Sports.create(sports)
            
            let { studentId } = result
            let sum = result.score1 + result.score2 + result.score3 + result.score4
            
            const student = await User.find({_id:studentId}).select('-_id name').lean()
            console.log(student)
            if (student!=null) {
                sports.user = student
                sports.sum = sum
                sports.time = result.time
                console.log(sports)
                return ctx.body = {
                    code: 200,
                    succeed: 1,
                    result: sports
                }
            }else{
                let result = await Sports.deleteOne(sports)
                return ctx.body = {
                    code: 200,
                    succeed: 0,
                    
                }
            }
            
            
        } catch (error) {
            return ctx.body = {
                code: 200,
                succeed: 0,
            }
        }
    }
    static async getMoralEdu(ctx) {
        try {
            const moralEdu = await MoralEdu.aggregate([

                {
                    $lookup: {
                        from: 'users',
                        localField: 'studentId',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $project: { _id: 1, 'user.name': 1, studentId: 1, score1: 1, score2: 2, score3: 3, score4: 4, time: 1, "sum": { "$add": ["$score1", "$score2", "$score3", "$score4"] } }
                },
                {
                    "$sort": { "_id": 1 }
                }
            ])

            // console.log(moralEdu)
            if (moralEdu.length > 0) {
                return ctx.body = {
                    result: moralEdu,
                    code: 200,
                    succeed: 1,
                }
            }

        } catch (error) {
            console.log(error)
        }
    }
    static async updateMoralEdu(ctx) { 
        try {

            const moral = ctx.request.body
            const { studentId, ...rest } = moral
            let result = await MoralEdu.findOneAndUpdate({ studentId: studentId }, rest, { new: true }).lean()
            result.sum = result.score1 + result.score2 + result.score3 + result.score4
            // console.log(result)
            if (result != null) {
                return ctx.body = {
                    result: result,
                    code: 200,
                    succeed: 1,
                }
            }
        } catch (error) {
            console.log(error)
        }
     
    }
    static async delMoralEdu(ctx) {
        try {
            const moral = ctx.request.body
            console.log(moral)
            const result = await MoralEdu.deleteOne(moral)
            console.log(result)
            if (result != null && result.ok === 1 && result.deletedCount === 1) {
                return ctx.body = {
                    result: moral,
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
            
        }
     }
    static async addMoralEdu(ctx) { 
        try {
            const moral = ctx.request.body
            let result = await MoralEdu.create(moral)
            // console.log(result)
            let { studentId } = result
            let sum = result.score1 + result.score2 + result.score3 + result.score4

            const student = await User.find({ _id: studentId }).select('-_id name').lean()
            
            if (student.length>0) {
                moral.user = student
                moral.sum = sum
                moral.time = result.time
                return ctx.body = {
                    code: 200,
                    succeed: 1,
                    result: moral
                }
            } else {
                let result = await MoralEdu.findByIdAndDelete({ _id: moral._id})
                return ctx.body = {
                    code: 200,
                    succeed: 0,

                }
            }
        } catch (error) {
            return ctx.body = {
                code: 200,
                succeed: 0,
            }
        }
    }
}

module.exports = AdminControllers
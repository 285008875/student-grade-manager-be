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
const AllGrade = require('../models/allgrade')
const MoralEdu = require('../models/moraledu')
const Sports = require('../models/sports')

class monitorControllers{
    static async getStudentGradeInClass(ctx) {
        const user = decodeToken(ctx)
        let { classId } = user
        classId = parseInt(classId)
        console.log(classId)
        const student = await User.find({ classId: classId, $or: [{ roleId: 's123' }, { roleId: 'm123' }]  }, { _id: 1 })
            .then(function (docs) {
                const result = [];
                docs.map((doc) => {
                    result.push(doc._id)
                })
                // console.log(result)
                return result
            })
        // console.log(student)
        const result = await Grade.find({ studentId: { $in: student } })
            .populate('studentId', {
                _id: 1,
                name: 1,
                // match:{}
            })
            .populate('courseId', {
                _id: 1,
                courseName: 1
            })
            .lean()
        if (result.length != 0) {
            return ctx.body = {
                code: 200,
                succeed: 1,
                result: result
            }
        } else {
            return ctx.body = {
                code: 200,
                succeed: 0
            }
        }
    }
    static async updeteGrade(ctx) {
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
    static async deleteGrade(ctx) {
        try {
            const grade = ctx.request.body
            // console.log("grade", grade)
            const { _id, ...rest } = grade
            console.log(_id)
            let result = await Grade.findByIdAndDelete(_id)
            console.log(result)
            if (result != null) {
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
    static async handleFileUpload(ctx) {
        try {

            const { path, type } = ctx.request.files.GradeFile
            // console.log(path)
            if (type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                const workbook = xlsx.readFile(path);
                const rows = xlso.parseWorkbook(workbook, 0, 0);
                // console.log(rows)
                let result = await Grade.insertMany(rows)

                // console.log(result)
                let filePath = Path.join(__dirname, '../upload/')

                await fs.emptyDir(filePath)
                if (result.length !== 0) {
                    return ctx.body = {
                        code: 200,
                        succeed: 1,
                        // result: result
                    }
                }
            }
        } catch (error) {
            console.log(error, '文件上传错误')
        }
    }
    static async handleFileDownload(ctx) {
        try {
            const user = decodeToken(ctx)
            let { classId } = user
            classId = parseInt(classId)
            console.log(classId)
            const student = await User.find({ classId: classId, roleId: 's123' }, { _id: 1 })
                .then(function (docs) {
                    const result = [];
                    docs.map((doc) => {
                        result.push(doc._id)
                    })
                    // console.log(result)
                    return result
                })
            // console.log(student)
            const result = await Grade.find({ studentId: { $in: student } })
                .populate('studentId', {
                    name: 1,
                    // match:{}
                })
                .populate('courseId', {
                    courseName: 1
                })
                .lean()
                .then((docs) => {
                    console.log(docs);

                    return docs
                    // docs.map((doc)=>{

                    // })
                })
            const filePath = Path.join(__dirname, '../upload/')
            await fs.emptyDir(filePath, (err) => {
                console.log("err", err)
            })
            console.log(result)
            await json2xlsx.write(filePath + '/test.xlsx', 'worksheet1', result)
            ctx.attachment('test.xlsx');
            await send(ctx, './upload/test.xlsx')
        } catch (error) {
            console.log(error)
        }

    }
    static async getAllgrade(ctx) {
        const user = decodeToken(ctx)
        let { classId } = user
        classId = parseInt(classId)
        const student = await User.find({ classId: classId, $or: [{ roleId: 's123' }, { roleId: 'm123' }]  }, { _id: 1 })
            .then(function (docs) {
                const result = [];
                docs.map((doc) => {
                    result.push(doc._id)
                })
                // console.log(result)
                return result
            })
        // console.log(student)
        const grade = await Grade.aggregate([
            {
                $project: { studentId: 1, score: 1, semester: 1 }
            },
            {
                $match: { studentId: { $in: student } }
            },
            {
                $group: { _id: "$studentId", intellectualSum: { $sum: "$score" }, intellectualAvg: { $avg: "$score" } }
            },
            {
                $sort: {
                    _id: 1
                }
            }
        ])
            .then((docs) => {
                // console.log(docs)
                docs.map(async (doc) => {
                    const { _id, ...rest } = doc;
                    await AllGrade.updateOne({ _id: _id }, rest, { upsert: true })
                })
            })



        const moralEdu = await MoralEdu.aggregate([
            {
                $match: { studentId: { $in: student } }
            },
            {
                $project: { studentId: 1, time: 1, "moralEduSum": { "$add": ["$score1", "$score2", "$score3", "$score4"] }, "moralEduAvg": { "$avg": ["$score1", "$score2", "$score3", "$score4"] } }
            },
            {
                "$sort": { "studentId": 1 }
            }
        ])
            .then((docs) => {
                const result = [];
                // console.log(docs)
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
                $match: { studentId: { $in: student } }
            },
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
                $match: { _id: { $in: student } }
            },
            {
                $project: {

                    _id: 1,
                    'user.name': 1,
                    intellectualAvg: 1,
                    intellectualSum: 1,
                    moralEduAvg: 1,
                    moralEduSum: 1,
                    SportAvg: 1,
                    SportSum: 1,
                    time: 1,
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

        if (result.length > 0) {
            return ctx.body = {
                result: result,
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
    static async getSports(ctx) {
        try {
            const user = decodeToken(ctx)
            let { classId } = user
            classId = parseInt(classId)
            const student = await User.find({ classId: classId, $or: [{ roleId: 's123' }, { roleId: 'm123' }]  }, { _id: 1 })
                .then(function (docs) {
                    const result = [];
                    docs.map((doc) => {
                        result.push(doc._id)
                    })
                    return result
                })

            const sports = await Sports.aggregate([
                {
                    $match: { studentId: { $in: student } }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'studentId',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        'user.name': 1,
                        studentId: 1,
                        score1: 1,
                        score2: 2,
                        score3: 3,
                        score4: 4,
                        time: 1,
                        "sum": {
                            "$add": ["$score1", "$score2", "$score3", "$score4"]
                        }
                    }
                },
                {
                    "$sort": { "_id": 1 }
                }
            ])
            if (sports.length > 0) {
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
        } catch (error) {
            console.log(error)
        }
    }
    static async updateSports(ctx) {
        try {

            const sports = ctx.request.body
            const { studentId, ...rest } = sports
            let result = await Sports.findOneAndUpdate({ studentId: studentId }, rest, { new: true }).lean()
            result.sum = result.score1 + result.score2 + result.score3 + result.score4
            console.log(result)
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
    static async delSports(ctx) {
        const sports = ctx.request.body
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
            const sports = ctx.request.body

            let result = await Sports.create(sports)

            let { studentId } = result
            let sum = result.score1 + result.score2 + result.score3 + result.score4

            const student = await User.find({ _id: studentId }).select('-_id name').lean()
            console.log(student)
            if (student != null) {
                sports.user = student
                sports.sum = sum
                sports.time = result.time
                console.log(sports)
                return ctx.body = {
                    code: 200,
                    succeed: 1,
                    result: sports
                }
            } else {
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
            const user = decodeToken(ctx)
            let { classId } = user
            classId = parseInt(classId)
            const student = await User.find({ classId: classId, $or: [{ roleId: 's123' }, { roleId: 'm123' }]  }, { _id: 1 })
                .then(function (docs) {
                    const result = [];
                    docs.map((doc) => {
                        result.push(doc._id)
                    })
                    return result
                })

            const sports = await MoralEdu.aggregate([
                {
                    $match: { studentId: { $in: student } }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'studentId',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        'user.name': 1,
                        studentId: 1,
                        score1: 1,
                        score2: 2,
                        score3: 3,
                        score4: 4,
                        time: 1,
                        "sum": {
                            "$add": ["$score1", "$score2", "$score3", "$score4"]
                        }
                    }
                },
                {
                    "$sort": { "_id": 1 }
                }
            ])
            if (sports.length > 0) {
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

            if (student.length > 0) {
                moral.user = student
                moral.sum = sum
                moral.time = result.time
                return ctx.body = {
                    code: 200,
                    succeed: 1,
                    result: moral
                }
            } else {
                let result = await MoralEdu.findByIdAndDelete({ _id: moral._id })
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
module.exports = monitorControllers
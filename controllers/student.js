const xlso = require('xlso');
const xlsx = require('xlsx');
const json2xlsx = require('json2xlsx')
const send = require('koa-send')
const Path = require('path')
const fs = require('fs-extra')
const User = require('../models/user');
const Clazz = require('../models/class.js')
const Grade = require('../models/grade')
const AllGrade = require('../models/allgrade')
const MoralEdu = require('../models/moraledu')
const Sports = require('../models/sports')

class StudentControllers{
    static async getClassName (ctx){
        try {
            const clazz = await Clazz.find({}).select('_id className')
            console.log(clazz)
            if (clazz.length>0) {
                return ctx.body={
                    succeed:1,
                    code:200,
                    result: clazz
                }
            }
            
        } catch (error) {
            
        }

    }
    static async getSports(ctx) {
        try {
            const user = decodeToken(ctx)
            let { classId } = user
            classId = parseInt(classId)
            const student = await User.find({ classId: classId, $or: [{ roleId: 's123' }, { roleId: 'm123' }] }, { _id: 1 })
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
    static async getMoralEdu(ctx) {
        try {
            const user = decodeToken(ctx)
            let { classId } = user
            classId = parseInt(classId)
            const student = await User.find({ classId: classId, $or: [{ roleId: 's123' }, { roleId: 'm123' }] }, { _id: 1 })
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
    static async getStudentGradeInClass(ctx) {
        const user = decodeToken(ctx)
        let { classId } = user
        classId = parseInt(classId)
        console.log(classId)
        const student = await User.find({ classId: classId, $or: [{ roleId: 's123' }, { roleId: 'm123' }] }, { _id: 1 })
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
    static async getAllgrade(ctx) {
        const user = decodeToken(ctx)
        let { classId } = user
        classId = parseInt(classId)
        const student = await User.find({ classId: classId, $or:[{roleId:'s123'},{roleId:'m123'}]}, { _id: 1 })
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

}
module.exports = StudentControllers
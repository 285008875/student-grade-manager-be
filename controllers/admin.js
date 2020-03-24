const User = require('../models/user');
const Clazz = require('../models/class.js')
class AdminControllers {

    static async getClass(ctx) {
        try {
            const result = await Clazz.find();
            // console.log(result)
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
}

module.exports = AdminControllers
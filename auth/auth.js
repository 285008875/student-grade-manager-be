const crypto = require("crypto");
const jwt = require('jsonwebtoken');
const SECRET = require('../config/config.js').secret;

const genPassword = (content) => {
    let md5 = crypto.createHash('md5');
    return md5.update(content + SECRET).digest("hex");

}

const comparePassword = (publicKey, secretKey) => {
    console.log(genPassword(publicKey), secretKey)
    if (genPassword(publicKey) === secretKey) {
        return true
    }
    return false
}

const setToken = (payload) => {
    // console.log("settoken", payload);
    // console.log(SECRET, payload)
    return jwt.sign(payload, SECRET, {
        expiresIn: '4h'
    })
}


const verifyToken = async (ctx, next) => {
    try {
        if (!ctx.header || !ctx.header.authorization) {
            ctx.status = 401;
            ctx.body = {
                error: err.originalError ? err.originalError.message : err.message,
                // error: 'Protected resource, use Authorization header to get access\n'
            };
        }
        let token = ctx.headers.authorization.split(" ");
        let decoded = jwt.verify(token[1], SECRET);
        // console.log("studentRouter", decoded)
        ctx.state = {
            user: decoded
        }
        // ctx.state.user = decoded

        await next();
    } catch (err) {
        console.log(err)
    }
}

decodeToken = (ctx) => {
    let token = ctx.headers.authorization.split(" ");
    let decoded = jwt.decode(token[1]);
    return decoded
}
module.exports = {
    genPassword,
    comparePassword,
    setToken,
    verifyToken,
    decodeToken

}
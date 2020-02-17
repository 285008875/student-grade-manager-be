module.exports = errorHandle = (ctx, next) => {
    return next().catch((err) => {
        // console.log("ctx.headers.authorization", ctx.headers.authorization)
        if (err.status === 401) {
            ctx.status = 401;
            ctx.body = {
                error: err.originalError ? err.originalError.message : err.message,
                // error: 'Protected resource, use Authorization header to get access\n'
            };
        } else {
            throw err;
        }
    });
}
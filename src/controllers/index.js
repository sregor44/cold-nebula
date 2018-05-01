/**
 * @param  {Context} ctx - A Koa Context
 * @returns {Promise} - Returns a promise that resolves to undefined
 */
async function index(ctx) {
    return ctx.render('index.hbs');
}

module.exports = {
    index,
};

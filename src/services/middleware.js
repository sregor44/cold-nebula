const Interests = require('../models/interests');

/**
 * Middleware that checks if a user is logged in. If so,
 * it calls the function/handler/middleware, otherwise it
 * returns a 401 response.
 * @param  {Context} ctx - A Koa Context
 * @param  {Function} next - The next function to call to handle the request
 * @returns {Promise} - Returns a promise that resolves to undefined
 */
async function mustBeAuthorized(ctx, next) {
    if (ctx.isAuthenticated()) {
        return next();
    }
    return ctx.throw(401, 'Unauthorized');
}

async function loadInterests(ctx, next) {
  if (ctx.isAuthenticated() && ctx.state.user) {
    ctx.state.interests = await Interests.getAllInterests(ctx.db);
  }
  return next();
}


module.exports = {
    mustBeAuthorized,
    loadInterests,
};

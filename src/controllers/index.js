/**
 * @param  {Context} ctx - A Koa Context
 * @returns {Promise} - Returns a promise that resolves to undefined
 */
async function index(ctx) {
  if (ctx.query['g-auth'] === 'fail') {
    ctx.state.loginFail = true;
  } else {
    ctx.state.loginFail = false;
  }

  return ctx.render('index.hbs');
}

module.exports = {
    index,
};

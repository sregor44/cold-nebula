const passport = require('koa-passport');

async function authCallback(ctx) {
  //Check to see if the recently logged in user is new or already exists
  //If the user is new, redirect to a registration process
  //console.log(ctx.state.user);

  var registered = ctx.state.user.is_registered;

  if (registered) {
    return ctx.redirect('/');
  }

  return ctx.render('register.hbs');
}

module.exports = {
  authCallback,
};

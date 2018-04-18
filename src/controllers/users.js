const Users = require('../models/users');

async function login(ctx) {
  return ctx.redirect('/auth/google')
}

async function logout(ctx) {
    await ctx.logout();

    return ctx.redirect('/');
}

module.exports = {
  login,
  logout,
};

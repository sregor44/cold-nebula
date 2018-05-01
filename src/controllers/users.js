const Users = require('../models/users');

async function login(ctx) {
  return ctx.redirect('/auth/google')
}

async function logout(ctx) {
    await ctx.logout();

    return ctx.redirect('/');
}


async function finishRegistration(ctx) {
    const db = ctx.db;
    const email = ctx.state.user.email;
    const college = ctx.request.body.college;
    const grad_year = ctx.request.body.year;

    await Users.setInfoForUser(db, email, college, grad_year);
    await Users.setRegisteredForEmail(db, email);

    return ctx.redirect('/');
}

module.exports = {
  login,
  logout,
  finishRegistration,
};

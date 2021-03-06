const Users = require('../models/users');
const Interests = require('../models/interests');

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

async function profile(ctx) {
  ctx.state.interests = await Interests.getInterestsByUser(ctx.db, ctx.state.user.id);

  return ctx.render('profile.hbs');
}

async function allUsers(ctx) {
  ctx.state.users = await Users.getAllUsers(ctx.db);

  return ctx.render('users.hbs');
}

async function userProfile(ctx) {
  ctx.state.user_profile = await Users.getByID(ctx.db, ctx.params.userID);
  ctx.state.user_interests = await Interests.getInterestsByUser(ctx.db, ctx.params.userID);

  return ctx.render('user_profile.hbs');
}

module.exports = {
  login,
  logout,
  finishRegistration,
  profile,
  allUsers,
  userProfile,
};

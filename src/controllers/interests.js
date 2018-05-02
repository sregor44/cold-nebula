const Interests = require('../models/interests.js');

async function getInterest(ctx) {
  var interest = await Interests.getInterestById(ctx.db, ctx.params.interestID);
  ctx.state.interest = interest;

  var clubs = await Interests.getClubForInterest(ctx.db, ctx.params.interestID);
  ctx.state.clubs = clubs;

  var usersForInterest = await Interests.getUsersForInterest(ctx.db, ctx.params.interestID);
  ctx.state.usersForInterest = usersForInterest;

  var userHasInterest = await Interests.userHasInterest(ctx.db, ctx.state.user.id, ctx.params.interestID);
  ctx.state.userHasInterest = userHasInterest;

  return ctx.render('interest.hbs');
}

async function addInterest(ctx) {
  var interestId = ctx.params.interestID;
  var userId = ctx.state.user.id;

  await Interests.addUserInterest(ctx.db, userId, interestId);

  return ctx.redirect('/interests/' + interestId);
}

async function deleteInterest(ctx) {
  var interestId = ctx.params.interestID;
  var userId = ctx.state.user.id;

  await Interests.deleteUserInterest(ctx.db, userId, interestId);

  return ctx.redirect('/interests/' + interestId);
}

module.exports = {
  getInterest,
  addInterest,
  deleteInterest,
};

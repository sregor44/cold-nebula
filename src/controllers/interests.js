const Interests = require('../models/interests.js');

async function getInterest(ctx) {
  var interest = await Interests.getInterestById(ctx.db, ctx.params.interestID);
  ctx.state.interest = interest;

  var clubs = await Interests.getClubForInterest(ctx.db, ctx.params.interestID);
  ctx.state.clubs = clubs;

  var usersForInterest = await Interests.getUsersForInterest(ctx.db, ctx.params.interestID);
  ctx.state.usersForInterest = usersForInterest;

  return ctx.render('interest.hbs');
}

async function addInterest(ctx) {
  var interestId = ctx.params.interestID;
  var userId = ctx.state.user.id;

  await Interests.addUserInterest(ctx.db, userId, interestId);

  return ctx.redirect('/interests/' + interestId);
}

module.exports = {
  getInterest,
  addInterest,
};

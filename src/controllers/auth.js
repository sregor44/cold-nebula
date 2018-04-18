const passport = require('koa-passport');

async function googleAuthenticate(ctx) {
  passport.authenticate('google', {
      scope: "https://www.googleapis.com/auth/userinfo.profile"
  });
}

async function googleCallback(ctx) {
  passport.authenticate('google', {
  		successRedirect: '/auth/google/success',
  		failureRedirect: '/auth/google/failure'
  });
}

module.exports = {
  googleAuthenticate,
  googleCallback,
};

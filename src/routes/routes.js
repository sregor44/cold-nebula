const Router = require('koa-router');
const passport = require('koa-passport');

const indexController = require('../controllers/index.js');
const userController = require('../controllers/users.js');

const middleware = require('../services/middleware.js');

const router = new Router();
router.get('/', indexController.index);

router.get('/login', userController.login);
router.get('/logout', userController.logout);

router.get('/auth/google', passport.authenticate('google', {
  scope: ["https://www.googleapis.com/auth/userinfo.email",
          "https://www.googleapis.com/auth/userinfo.profile"]
}));

router.get('/auth/google/callback',
  passport.authenticate('google', {
      		successRedirect: '/',
      		failureRedirect: '/?g-auth=fail'
}));

//router.post('/user/login', userControllers.login);
//router.post('/user/register', userControllers.register);
//router.get('/user/logout', userControllers.logout);

module.exports = router;

const Router = require('koa-router');
const passport = require('koa-passport');

const indexController = require('../controllers/index.js');
const userController = require('../controllers/users.js');
const authController = require('../controllers/auth.js');
const interestController = require('../controllers/interests.js');

const middleware = require('../services/middleware.js');

const router = new Router();
router.get('/', middleware.loadInterests, indexController.index);

router.get('/login', userController.login);
router.get('/logout', userController.logout);

router.get('/auth/callback', authController.authCallback);

router.get('/auth/google', passport.authenticate('google', {
  scope: ["https://www.googleapis.com/auth/userinfo.email",
          "https://www.googleapis.com/auth/userinfo.profile"]
}));

router.get('/auth/google/callback',
  passport.authenticate('google', {
      		successRedirect: '/auth/callback',
      		failureRedirect: '/?g-auth=fail'
}));

router.post('/auth/complete_process', userController.finishRegistration)

router.get('/interests/:interestID', interestController.getInterest);
router.get('/addToInterest/:interestID', interestController.addInterest);

//router.post('/user/login', userControllers.login);
//router.post('/user/register', userControllers.register);
//router.get('/user/logout', userControllers.logout);

module.exports = router;

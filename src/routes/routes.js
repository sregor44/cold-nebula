const Router = require('koa-router');
const passport = require('koa-passport');
const indexControllers = require('../controllers/index.js');

const { mustBeAuthorized } = require('../services/middleware.js');

const router = new Router();
router.get('/', indexControllers.index);
//router.post('/user/login', userControllers.login);
//router.post('/user/register', userControllers.register);
//router.get('/user/logout', userControllers.logout);

module.exports = router;

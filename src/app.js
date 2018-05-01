const Koa = require('koa');
const serve = require('koa-static')
const router = require('./routes/routes.js');
const pgp = require('pg-promise')();
const views = require('koa-views');
const bodyParser = require('koa-bodyparser');
const path = require('path');
const passport = require('koa-passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const session = require('koa-session');

const Initializer = require('./models/init.js');
const Users = require('./models/users.js');

/**
 * createApp - returns a Koa application given a config
 * @param  {object} config - the config for the app
 * @returns {app} A Koa application
 */
function createApp(config) {
    // Create our app
    const app = new Koa();

    app.use(serve(__dirname + '/static'));

    app.use(bodyParser());

    // Add the database to the app's context prototype.
    // This will make the db available in all controllers.
    app.context.db = pgp(config.databaseURL);

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((user_id, done) => {
      try {
        Users.getByID(app.context.db, user_id).then(function(user) {
          done(null, user);
        });
      } catch(err) {
        done(err, null);
      }
    });

    whipeDB = false;

    if (whipeDB) {
      Initializer.whipeDB(app.context.db).then(function() {
        Initializer.init(app.context.db);
      });
    } else {
      Initializer.init(app.context.db);
    }

    passport.use(new GoogleStrategy({
        clientID:     config.googleClientID,
        clientSecret: config.googleClientSecret,
        callbackURL: config.googleCallback,
        passReqToCallback   : true
      },
      async function(req, accessToken, refreshToken, profile, done) {
        var user = await Users.getByEmail(app.context.db, profile.email);

        if (user == null) {
          //Do not allow non-yale emails yet
          var domain = profile.email.replace(/.*@/, "");
          if (domain == "yale.edu") {
            user = await Users.insert(app.context.db, profile.displayName, profile.email)
                                            .catch(function(err) {
                                              return done(err, null);
                                            });

         } else {
           //Non yale email
           return done(null, null);
         }
       }

        return done(null, user);
      }
    ));

    app.keys = [config.secret];
    app.use(session(app));
    app.use(passport.initialize());
    app.use(passport.session());

    // Set the port for the app
    app.context.port = config.port;

    // Add view/template engine
    app.use(views(path.join(__dirname, 'views'), {
        map: { hbs: 'handlebars' },
        options: {
          helpers: {
          },
        },
    }));

    // Attach our routes.
    app.use(router.routes());
    return app;
}

// This module exports a function that must
// be called to get an app. It is passed a
// configuration object, as indicated above.
module.exports = createApp;

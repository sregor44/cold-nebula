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
const Interests = require('./models/interests.js');

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

    var wipeDB = config.wipeDB === "true";

    if (wipeDB) {
      Initializer.wipeDB(app.context.db);
    } else {
      Initializer.init(app.context.db);
    }

    var initValues = config.insertDefaultData === "true";

    if (initValues) {
      var initInterests =
        {
          "interests": {
            "Music": {
              "YSO": "Yale Symphony Orchestra",
              "Jazz Collective": "",
              "YPMB": "Yale Precision Marching Band"
            },
            "Environmentalism": {
              "YSEC": "Yale Student Environmental Coalition",
              "S4CD": "Students For Carbon Dividends"
            },
            "Art": {
              "Yale Art Society": "Painters, sculptors, drawers, sketchers, photographers, pottery-makers, artists of many kinds - welcome to a Society for the Visual Arts! Yale, a place that thrives with arts all across the spectrum, from dance groups to theatre productions, somehow has failed to address the vital, thrilling work of visual artists."
            },
            "Politics": {
              "Yale College Democrats": "",
              "Yale College Republicans": ""
            },
            "Technology": {
              "Code for Good": "Code for Good empowers students to use technology for social impact. We create opportunities to learn and meaningfully contribute to technical projects for students interested in the intersection of computer science, data science, and technology with social good."
            },
            "Outdoors": {
              "Yale Outdoors": ""
            },
            "Cooking": {
              "VARSITY Baking Club": "VARSITY is an acronym, which stands for \"Vegan and Allergy-Restricted Sweets in the Tummies of Yalies.\" The inspiration for this club came from a perceived lack of accessible foods, particularly desserts, in Yale dining halls. Additionally, the abundance of comments such as \"I don't eat vegan food, it's gross\" and \"it just doesn't taste the same without [___ingredient]\" were motivation to reverse this stigma around accessible food. Thus, this club is both a baking club: we share and exchange recipes to others in the food allergy and vegan communities, and it is an advocacy club: we advocate for more accessible food options and show, by example, how simple substitutions can lead to tremendously more accessible (and perhaps more popular) food."
            },
            "Soccer": {
              "Yale Women's Club Soccer": "Yale Women’s Club Soccer (YWCS) is a competitive club program that draws undergraduate players who are serious about soccer but cannot or choose not to play at the varsity level. Players have had experience playing at high school and/or club levels. The team plays year-round- facing other college club teams in the fall, playing in a local indoor league in the winter, and returning to outdoor collegiate games in the spring. In the fall, we typically participate in the NIRSA Region 1 league, playing at least six games. During our outdoors seasons in the fall and spring we practice twice a week at Smilow Field Center. In the winter, we continue practicing indoors at Payne Whitney Gymnasium. Soccer aside, YWCS is a very close-knit group, one that some might call – a family.",
              "Yale Men's Club Soccer": ""
            },
            "Spike Ball": {
              "Yale Roundnet Club": ""
            },
            "Ultimate Frisbee": {
              "Superfly: Yale Men's Ultimate": "Interested in playing competitive ultimate? Whether you have never played a game before, are looking for an activity to keep you in shape, or are a seasoned pro seeking competition to drive your game to the next level, Süperfly is the right team for you."
            },
            "Fortnite": {

            },
            "Space": {
              "STARRY": "STARRY is the undergraduate Society for Telescopes and Astronomical Research and Recreation at Yale.  It was founded in Fall 2000. Our primary goal is to spread an interest in observing the sky to as many people as we can, both in Yale and in the surrounding community.  To accomplish this, we host stargazing parties open to anyone who wishes to look through a telescope, whether it be for two minutes on the way to a section, or for two hours to observe a meteor storm.  We also help run the new digital planetarium at the Leitner Observatory.",
              "Yale Undergraduate Aerospace Association": "YUAA members work in teams to build and fly rockets, planes, quadcopters, and unmanned aerial vehicles. From first idea to finished aircraft, YUAA projects are entirely student-run. Since 2010, YUAA has helped foster Yale’s engineering community by welcoming students of any experience level or background and hosting events to promote aerospace engineering on campus."
            },
            "Business": {
              "YES": "Founded in 1999, the Yale Entrepreneurial Society (YES) is a completely undergraduate run 501(c)3 non-profit dedicated to promoting innovation in the Yale community. Our programs include the ELI Speaker Series, our semesterly Entrepreneurship Bootcamp workshop series, and the annual Yale Venture Challenge. Alumni have gone on to found companies including General Assembly, Higher One, and Silviaterra."
            },
            "Engineering": {
              "CEID": "Yale Center for Engineering Innovation and Design"
            },
            "Chess": {
              "Yale College Chess Club": ""
            }
          }
        };

        for (var interest in initInterests.interests) {
          Interests.insert(app.context.db, interest).then(function(response) {
            for (var club in initInterests.interests[response.group_name]) {
              Interests.addClub(app.context.db, response.id, club, initInterests.interests[response.group_name][club])
            }
          });
        }
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
           //Reject non-yale email
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
            eq: (first, second) => {
              return (first === second);
            },
            nEq: (first, second) => {
              return (first !== second);
            }
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

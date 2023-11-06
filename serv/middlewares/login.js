const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const config = require("../../config.js");
const { User } = require(config.SERV + "/helpers/db.js");
const uid = require(config.SERV + "/helpers/uid.js");


passport.use("local" , new LocalStrategy(
    (username, password, done) => {
      User.findOrCreate({ where: { username: username } })
        .spread((user, created) => {
          if (created) {
            // Nuevo usuario
            return done(null, false);
          }
  
          if (password != user.password) {
            return done(null, false);
          }
  
          return done(null, user);
        })
        .catch(err => {
          return done(err);
        });
    }
  ));
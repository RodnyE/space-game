const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const config = require("../../config.js");
const { User } = require(config.SERV + "/helpers/db.js");
const uid = require(config.SERV + "/helpers/uid.js");


passport.use("local", new LocalStrategy(
  async (username, password, done) => {
    try {
      const [user, created] = await User.findOrCreate({
        where: { username, password },
        defaults: {
          username,
          password,
          user_id: uid.alphanum(8)
        }
      });
      done(null, user || created);
    } catch (err) {
      done(err);
    }
  }
));
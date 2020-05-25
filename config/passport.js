const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const UsersService = require("../services/users.service")();
const config = require("./env");

module.exports = function (passport) {
  let opts = {};
  opts.secretOrKey = config.secret;
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  passport.use(
    new JwtStrategy(opts, function (jwt_payload, done) {
      UsersService.getUserByEmail(jwt_payload.email)
        .catch(function (err) {
          if (err) {
            return done(err, false);
          }
        })
        .then(function (user) {
          if (user) {
            user.password = undefined;
            return done(null, user);
          } else {
            return done(null, false);
          }
        });
    })
  );
};

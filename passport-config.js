const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('./model/user');

module.exports = function() {
  passport.serializeUser(function(user, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use('login', new LocalStrategy(
    function(username, password, done) {
      User.findOne({ username: username }, function(err, user) {
        if(err) { return done(err); }
        if(!user) {
          return done(null, false, { message: 'No user has that username' });
        }
        user.checkPassword(password, function(err, isMatch) {
          if(err) { return done(err); }
          if(isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Invalid password.' })
          }
        });
      });
    }
  ));
};

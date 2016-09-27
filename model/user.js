const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const HASH = 10;

const userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true},
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  displayName: String,
  bio: String
});

// Do nothing function for use
// with the bcrypt module
var noop = function() {};

// Encrypt user password
userSchema.pre('save', function(done) {

  var user = this;

  if(!user.isModified('password')) {
    return done();
  }

  bcrypt.genSalt(HASH, function(err, hash) {
    if(err) { return done(err); }
    bcrypt.hash(user.password, hash, noop, function(err, hashedPassword) {
      if(err) { return done(err); }
      user.password = hashedPassword;
      done();
    });
  });
});

// *** Schema methods *** //

// Check password equality (high level checking)
userSchema.methods.checkPassword = function(guess, done) {
  bcrypt.compare(guess, this.password, function(err, isMatch) {
    done(err, isMatch);
  })
};

userSchema.methods.name = function() {
  return this.displayName || this.username;
};


const User = mongoose.model('User', userSchema);

module.exports = User;

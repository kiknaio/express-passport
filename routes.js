const express = require('express');
const passport = require('passport');

const User = require('./model/user');

var router = express.Router();

router.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.info = req.flash('info');
  next();
});

router.get('/', (req, res, next) => {
  User.find()
    .sort({ createdAt: 'descending' })
    .exec((err, users) => {
      if(err) { return next(err); }
      res.render('index', { users: users});
    });
});

router.get('/signup', (req ,res) => {
  res.render('signup');
});

router.post('/signup', (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username }, (err, user) => {
    if(err) { return next(err); }
    if(user) {
      req.flash('error', 'User already exists');
      return res.redirect('/signup');
    }

    var newUser = new User({
      username: username,
      password: password
    });
    newUser.save(next);
  });
}, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/signup',
  failureFlash: true
}));

module.exports = router;

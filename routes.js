const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('./model/user');

var router = express.Router();

// Ensure is user is authenticated
function ensureAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    next();
  } else {
    req.flash('info', 'You must be logged in to see this page.');
    red.redirect('/login');
  }
}

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

router.get('/edit', ensureAuthenticated, function(req, res) {
  res.render('edit');
});

router.post('/edit', ensureAuthenticated, function(req, res, next) {
  req.user.displayName = req.body.displayname;
  req.user.bio = req.body.bio;
  req.user.save(function(err) {
    if(err) {
      next(err);
      return;
    }
    req.flash('info', 'Profile updated!');
    res.redirect('/edit');
  });
});

router.get('/login', function(req, res) {
  res.render('login');
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/users/:username', function(req ,res) {
  User.findOne({
    username: req.params.username,
  }, function(err, user) {
    if(err) { return next(err); }
    if(!user) { return next(404); }
    res.render('profile', { user:user })
  });
});

router.get('/signup', (req ,res) => {
  res.render('signup');
});


router.post('/signup', (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username }, function(err, user) {
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
  failureRedirect: '/login',
  failureFlash: true
}));


module.exports = router;

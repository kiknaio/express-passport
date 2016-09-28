const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./model/user');

const passportConfig = require('./passport-config');


const routes = require('./routes');

const app = express();

// Initialize Passport local strategy
passport.use(new LocalStrategy(
  function(username, password, cb) {
    User.findOne({ username: username }, function(err, user) {
      if(err) { return cb(err); }
      if(!user) { return cb(null, false); }
      if(user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
  }
));

mongoose.connect('mongodb://localhost:27017/test');
passportConfig();

app.set('port', process.env.PORT || 3000);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'myfirstexpressappwithpassport',
  resave: true,
  saveUninitialized: true
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

app.listen(app.get('port'), ()=> {
  console.log('Server is running on port ' + app.get('port'));
});

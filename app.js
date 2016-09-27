const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');

const routes = require('./routes');

const app = express();

mongoose.connect('mongodb://localhost:27017/test');

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

app.use(routes);

app.listen(app.get('port'), ()=> {
  console.log('Server is running on port ' + app.get('port'));
});

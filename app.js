const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fileUpload = require('express-fileupload')
const session = require('express-session');
const nocache = require('nocache');

const app = express();
require('dotenv').config();

const adminRouter = require('./routes/admin/admin');
const usersRouter = require('./routes/user/users');


const db = require("./config/connection");
app.use(nocache());



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



// database

db.connect((err) => {
  if (err) console.log("connection Error" + err);
  else console.log("Database connect successfully");
});


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());

// session setting
app.use(session({
  secret: 'keyboard cat',
  key: 'user_id',
  resave: false,
  saveUninitialized : false,
  cookie : {
    maxAge : 60000000
  }
}));




app.use('/', usersRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

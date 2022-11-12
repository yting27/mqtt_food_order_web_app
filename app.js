var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs');
var favicon = require('serve-favicon');
var db_access = require('./database/access')

var indexRouter = require('./routes/index');
var ordersRouter = require('./routes/orders');


var app = express();

// Connect to DB
db_access.connectToDB();


app.use(favicon(__dirname + '/public/images/favicon.ico'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('common', {
  stream: fs.createWriteStream('./logs/server.log', { flags: 'a' })
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/orders', ordersRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('pages/error', { error: err, title: "Error Page" });
});

module.exports = app;

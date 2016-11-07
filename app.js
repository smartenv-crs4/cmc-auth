var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
//var LocalStrategy = require('passport-local').Strategy;
var logger = require('morgan');
var jwtMiddle = require('./routes/jwtauth');
var favicon = require('serve-favicon');

var conf = require('propertiesmanager').conf;
//var User = require('./models/users').User;

var routes = require('./routes/index');
var auth = require('./routes/auth');
var apps = require('./routes/apps');
var actions = require('./routes/actions');
var msReg = require('./routes/microserviceReg');
var userType=require('./routes/userTypes');
var appType=require('./routes/appTypes');

var app = express();

// var conf = null;
//
// if (app.get('env') === 'dev') {
//     conf = config.dev;
// }
// else{
//     conf = config.production;
// }
//require('./models/db')
//connect to DB
///...


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.set('jwtTokenSecret', 'YOUR_SECRET_STRING');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));

// for timestamps in logger
app.use(logger('dev'));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));
//app.use(passport.initialize());
app.use(cookieParser("supercalifragilistichespiralitoso"));
//app.use(cookieParser());
// static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/doc', express.static('doc',{root:'doc'}));
app.use('/node_modules', express.static('node_modules',{root:'node_modules'}));


//app.use(logger('[:mydate] :method :url :status :res[content-length] - :remote-addr - :response-time ms'));


// passport-local-mongoose initialization
//passport.use(new LocalStrategy(User.authenticate()));



app.use('/',routes);
app.use('/main',routes);

app.use(jwtMiddle.decodeToken);


app.use('/authuser',auth); // authorization routes
app.use('/authapp',apps); // authorization routes
app.use('/tokenactions',actions); // authorization routes
app.use('/authms', msReg);
app.use('/usertypes', userType);
app.use('/apptypes', appType);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'dev') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;

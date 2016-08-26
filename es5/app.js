var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//  Import the packages we just installed :
var methodOverride = require("method-override");
var mongoose = require("mongoose");
var session = require("express-session");
var MongoStore = require("connect-mongo")(session);

// Connect to mongodb
mongoose.connect("mongodb://localhost/iotdb", function(err) {
    if (err) throw err;
    console.log("Successfully connected to mongodb");
});

// Loading DB models.
var user = require("./models/user");
var streams = require("./models/stream");

// Loading routes.
var routes = require('./routes/index');
var users = require('./routes/users');
var streams = require("./routes/streams");
var stream = require("./routes/stream");
var input = require("./routes/input");
var output = require("./routes/output");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(favicon(path.join(__dirname, "public/images/favicon.ico")));

// We use mongodb to store session info
// expiration of the session is set to 7 days (ttl option)
app.use(session({
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 7*24*60*60
    }),
    saveUninitialized: true,
    resave: true,
    secret: "MyBigBigSecret"
}));

 // Used to manipulate post requests and recongize PUT and DELETE operations
app.use(methodOverride(function(req, res){
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method
      delete req.body._method
      return method
    }
}));

app.use('/', routes);
app.use('/users', users);
app.use("/streams", streams);
app.use("/stream", stream);
app.use("/input", input);
app.use("/output", output);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// will print stacktrace
if (app.get('env') === 'development') {
    // output pretty html.
    app.locals.pretty = true;

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

"use strict";

import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

// Import the packages we just installed
import methodOverride from 'method-override';
import mongoose from 'mongoose';
import session from 'express-session';
import connectMongo from 'connect-mongo';
const MongoStore = connectMongo(session);

// Connect to mongodb
mongoose.connect("mongodb://localhost/iotdb", function(err) {
    if (err) throw err;
    console.log("Successfully connected to mongodb");
});

// Loading DB models.
import user from './models/user';
import stream from './models/stream';

// Loading routes.
import index from './routes/index';
import users from './routes/users';
import streams from './routes/streams';
import input from './routes/input';
import output from './routes/output';

//using let
let app = express();

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
      ttl: 7 * 24 * 60 * 60
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

app.use("/", index);
app.use("/users", users);
app.use("/streams", streams);
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

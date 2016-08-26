"use strict";

// Import express and its router.
import express from 'express';
let router = express.Router();

// Include the required models and our helper.
import mongoose from 'mongoose';
import helper from '../utils';
let User = mongoose.model("User");
let Stream = mongoose.model("Stream");

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// Views controllers
// GET landing/ index page
router.get("/", function(req, res, next) {

    var errorMessage = req.session.error;
    var successMessage = req.session.success;
    var isAdmin = req.session.user ? true : false;

    // since messages have been served, delete from session
    delete req.session.error;
    delete req.session.success;

    return res.render("index", {
        errorMessage: errorMessage,
        successMessage: successMessage,
        isAdmin: isAdmin
    });
});

// Get login page.
router.get("/login", function(req, res, next) {

    var errorMessage = req.session.error;
    var successMessage = req.session.success;

    // since messages have been served, delete from session
    delete req.session.error;
    delete req.session.success;

    User.count({}, function(err, count){

        // If a user is already registered, redirect to index
        // else render setup view in order to register
        if (count) {
            if (req.session.user) {
                return res.redirect("/");
            }

            return res.render("users/login", {
                errorMessage: errorMessage,
                successMessage: successMessage
            });
        }

        return res.redirect("/setup");
    });
});

// GET setup page
router.get("/setup", function(req, res) {

    var errorMessage = req.session.error;
    var successMessage = req.session.success;

    // since messages have been served, delete from session
    delete req.session.error;
    delete req.session.success;

    User.count({}, function(err, count){

        // If a user is already registered, redirect to index
        // else render setup view in order to register
        if (count) {
            return res.redirect("/login");
        }

        return res.render("users/setup", {
            errorMessage: errorMessage,
            successMessage: successMessage
        });
    });
});

// The first thing our user needs to be able to do is to POST a setup request in
// order to create his account. This request will redirect him to the index page
// where he will be able to create his first dataset.
// POST setup request
router.post("/setup", function(req, res) {

    // Get values from POST request
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;

    // Create new user document
    User.create({
        firstname: firstname,
        lastname: lastname,
        email: email,
        username: username,
        password: password
    }, function(err, user) {

        if (err) {
            console.log("Error creating the user: " + err);
            // http://mongoosejs.com/docs/validation.html
            // http://stackoverflow.com/questions/14407007/best-way-to-check-for-mongoose-validation-error
            var errors = [];
            if (err.name == 'ValidationError') {
                for (field in err.errors) {
                    errors.push(err.errors[field].message);
                }
            }
            req.session.error = "An error occurred creating the user: " +  errors.join(' ');
            return res.redirect("/setup");
        }

        console.log("POST creating new user: " + user);
        // Generate new session holding newly created user's info
        return req.session.regenerate(function() {
            req.session.user = user;
            req.session.success = "Authenticated as " + user.username;
            res.redirect("/");
        });
    })
});

// POST login request
router.post("/login", function(req, res) {

    // Get values form POST request
    var username = req.body.username;
    var password = req.body.password;

    // Find user document by username
    // If a user is returned but the passwords do not match, send error message indicating wrong password
    // If no user is returned, send error message indicating wrong username
    User.findOne({username:username}, function(err, user) {

        if (err) {
            console.log("Error retrieving user " + err);
            req.session.error = "A problem occurred while retrieving the user";
            return req.redirect("/login")
        }

        if (!user) {
            req.session.error = "Authentication failed, please check your username.";
            return res.redirect("/login");
        }

        // Use the method registered on the User model to compare entered password with user password
        user.comparePassword(password, function(err, isMatch) {
            if (err) {
                throw err;
            }
            if (!isMatch) {
                req.session.error = "Authentication failed, please check your password.";
                return res.redirect("/login");
            }
            req.session.regenerate(function() {
                req.session.user = user;
                req.session.success = "Authenticated as " + user.username;
                return res.redirect("/");
            });
        });
    });
});

// GET logout request.
// In case of logout we create a new session and redirect to
// the login page, serving the messages in the process if need be:
router.get("/logout", helper.authenticate, function(req, res) {

    var errorMessage = req.session.error;
    var successMessage = req.session.success;

    // Regenerate new session; session.detroy() is not used as we still want
    // the error/success messages to be served to the endpoint
    req.session.regenerate(function() {
        req.session.error = errorMessage;
        req.session.success = successMessage;
        return res.redirect("/");
    });
});

module.exports = router;

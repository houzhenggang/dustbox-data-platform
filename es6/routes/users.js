"use strict";

// Import express and its router.
import express from 'express';
let router = express.Router();

// Import the User schema and the authentication middleware.
import mongoose from 'mongoose';
import helper from '../utils';
let User = mongoose.model("User");

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// GET settings page
router.get("/settings", helper.authenticate, function(req, res) {
    var errorMessage = req.session.error;
    var successMessage = req.session.success;

    // since messages have been served, delete from session
    delete req.session.error;
    delete req.session.success;

    var isAdmin = req.session.user ? true : false;

    return res.render("users/settings", {
        user:req.session.user,
        errorMessage: errorMessage,
        successMessage: successMessage,
        isAdmin: isAdmin
    });
});

// GET create new user page
router.get("/make", helper.authenticate, function(req, res) {
    var errorMessage = req.session.error;
    var successMessage = req.session.success;

    // since messages have been served, delete from session
    delete req.session.error;
    delete req.session.success;

    var isAdmin = req.session.user ? true : false;

    return res.render("users/create", {
        errorMessage: errorMessage,
        successMessage: successMessage,
        isAdmin: isAdmin
    });
});

// Create new user - POST
// Create the first method of the API : POST used to create a new user.
router.post("/make", helper.authenticate, function(req, res, next) {

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
        // http://stackoverflow.com/questions/12557473/how-to-recover-from-duplicate-key-in-mongoose-express
        if (err && err.code !== 11000) {
            console.log("Error creating new user: " + err);
            req.session.error = "Error creating new user: "  + err;
            return res.redirect("/users/make");
        }

        // Duplicate key
        if (err && err.code === 11000) {
            req.session.error = "Error creating new user: "  + 'User already exists';
            return res.redirect("/users/make");
        }

        console.log("POST creating new user: " + username);
        req.session.success = "POST creating new user: " + username;
        return res.redirect("/users/make");
    })
});

// Update by ID - PUT
// The PUT request is used to update a user’s information. We
// ask the user to confirm its new password in case of change so that he doesn’t
// lock himself out of the app by mistake.
router.put("/:id/edit", helper.authenticate, function(req, res) {

    // Get form values
    var newFirstname = req.body.firstname;
    var newLastname = req.body.lastname;
    var newEmail = req.body.email;
    var newUsername = req.body.username;
    var newPassword = req.body.newPassword;
    var newPasswordBis = req.body.newPasswordConfirm;

    var passError = null;

    // Check if password and confirmation match
    if(newPassword||newPasswordBis) {
        if (newPassword != newPasswordBis) {
            newPassword = null;
            passError = true;
            req.session.error = "The passwords do not match, try again.";
            res.redirect("/users/settings");
        }
    }

    if (!passError) {

        //find user document by ID
        User.findById(req.params.id, function(err, user) {

            if (err) {
                console.log("Error retrieving user " + err);
                req.session.error = "A problem occured retrieving the user.";
                return res.redirect("/users/settings");
            }

            // Check what to update
            if (user.firstname != newFirstname) user.firstname = newFirstname;
            if (user.lastname != newLastname) user.lastname = newLastname;
            if (user.email != newEmail) user.email = newEmail;
            if (user.username != newUsername) user.username = newUsername;
            if (newPassword) user.password = newPassword;

            // Save is used instead of update so that the hashing middleware is called on the password
            user.save(user, function(err, userID) {

                if (err && err.code !== 11000) {
                    console.log("Error updating user: " + err);
                    req.session.error = "A problem occured updating the user.";
                    return res.redirect("/users/settings");
                }

                // Duplicate key
                if (err && err.code === 11000) {
                    req.session.error = "Error updating user: "  + 'Email or username already exists';
                    return res.redirect("/users/settings");
                }

                console.log("UPDATE user with id: " + userID);
                // Regenerate session with new user info
                return req.session.regenerate(function() {
                    req.session.user = user;
                    req.session.success = "Update successful";
                    res.redirect("/users/settings");
                });
            });
        });
    }
});

// Delete by ID - DELETE
// As for the DELETE request, it fetches the user matching
// the id provided in the url and deletes it as you would expect it to. An
// error/success message is passed to the session according to the result.
router.delete("/:id", helper.authenticate, function(req, res) {
    // Find user document by id
    User.findById(req.params.id, function(err, user){
        if (err) {
            console.log("Error retrieving user " + err);
            req.session.error = "A problem occured retrieving the user.";
            res.redirect("/users/settings");
        } else {
            // Remove user document
            user.remove(function(err, user){
                if (err) {
                    console.log("Error deleting the user " + err);
                    req.session.error = "A problem occured deleting the user.";
                    res.redirect("/users/settings");
                } else {
                    console.log("DELETE user with ID: " + user._id);
                    req.session.regenerate(function() {
                        req.session.success = "Account successfully deleted";
                        res.redirect("/setup");
                    })
                }
            });
        }
    });
});

module.exports = router;

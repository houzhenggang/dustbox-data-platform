var express = require('express');
var router = express.Router();

// Include the required models and our helper.
var mongoose = require("mongoose");
var Stream = mongoose.model("Stream");

// GET request to retrieve a stream data.
// @format:
// http://127.0.0.1:8080/stream/<alias>
// @example:
// http://127.0.0.1:8080/stream/nist_weather
router.get("/:alias", function(req, res) {

    var errorMessage = req.session.error;
    var successMessage = req.session.success;

    // since messages have been served, delete from session
    delete req.session.error;
    delete req.session.success;

    var isAdmin = req.session.user ? true : false;
    var alias = req.params.alias;

    // Find stream by alias
    Stream.findOne({
        alias: alias,
        hidden: 0
    }, function(err, stream) {

        if (err) {
            req.session.error = "Error retrieving the stream";
            return res.redirect("/");
        }

        if (!stream) {
            req.session.error = "No stream is found.";
            return res.redirect("/streams");
        }

        // Paginate the data in the data object.
        var data = {};
        var limit = 30;
        var page = req.query.page === undefined ? 0 : req.query.page - 1;
        var start = page * limit;
        // Round number upward to its nearest integer.
        var pages = Math.ceil(stream.entries_number / limit);

        // Reverse the value in the key so the latest date comes first.
        for (var key in stream.data) {
            data[key] = stream.data[key].reverse().splice(start, limit);
        }

        // Only send non-sensible info to res (ie: striped from API keys).
        // Get host name and port.
        // http://stackoverflow.com/questions/10183291/how-to-get-the-full-url-in-express
        var cleanStream = {
            _id : stream._id,
            title : stream.title,
            description: stream.description,
            public_key: stream.public_key,
            tags: stream.tags,
            created_at: stream.created_at,
            last_entry_at: stream.last_entry_at,
            entries_number: stream.entries_number,
            data: data
        };

        res.render("streams/show", {
            stream: cleanStream,
            page: page + 1,
            pages: pages,
            urlQuery: alias + '?page=',
            isAdmin: isAdmin,
            errorMessage: errorMessage,
            successMessage: successMessage
        });
    });
});

module.exports = router;

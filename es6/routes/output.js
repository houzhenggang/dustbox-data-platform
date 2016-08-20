var express = require('express');
var router = express.Router();

// Import dependencies.
var mongoose = require("mongoose");

// Import the User schema and the authentication middleware.
var Stream = mongoose.model("Stream");
var helper = require("../utils");

// GET request to read a stream data in json output.
// @examples:
// http://127.0.0.1:3000/output/stream?public_key=a785be6033a604066863f1a857393177
router.get("/stream", function(req, res) {

    // Get values from request arguments
    var publicKey = req.query.public_key;

    // Find stream by read API key
    Stream.findOne({
        public_key: publicKey
    }, function(err, stream) {

        if (err) {
            console.log("Error retrieving stream: " + err);
            res.set('Content-Type', 'application/json');
            return res.sendStatus(-1);
        }

        if (!stream) {
            console.log("No stream found for this API key: " + publicKey);
            res.set('Content-Type', 'application/json');
            return res.status(200).send('stream not found');
        }

        // Strip stream from sensible informations (_id and API keys)
        var cleanStream = {
            title: stream.title,
            description: stream.description,
            species: stream.species,
            created_at: stream.created_at,
            last_entry_at: stream.last_entry_at,
            entries_number: stream.entries_number,
            data: stream.data
        }

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE');

        // return stream as json.
        return res.status(200).json(cleanStream);
    });
});

// GET request to read streams data in json output.
// @examples:
// http://127.0.0.1:3000/output/streams
router.get("/streams", function(req, res) {

    var options = {
        hidden: '0'
    };

    // Find all public streams.
    Stream.find(options, function(err, streams) {

        if (err) {
            console.log("Error retrieving stream: " + err);
            res.set('Content-Type', 'application/json');
            return res.sendStatus(-1);
        }

        if (!streams) {
            res.set('Content-Type', 'application/json');
            return res.status(200).send('streams not found');
        }

        var cleanStreams = [];
        streams.forEach(function(stream, index) {
            cleanStreams.push({
                title: stream.title,
                description: stream.description,
                created_at: stream.created_at,
                last_entry_at: stream.last_entry_at,
                entries_number: stream.entries_number,
                public_key: stream.public_key,
            });
        });

        // return streams as json.
        return res.status(200).json(cleanStreams);
    });
});

module.exports = router;

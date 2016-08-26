"use strict";

// Import express and its router.
import express from 'express';
let router = express.Router();

// Import the User schema and the authentication middleware.
import mongoose from 'mongoose';
let Stream = mongoose.model("Stream");

// GET or POST request to push data to a stream.
// @format:
// http://127.0.0.1:8080/input/<public_key>?private_key=<private_key>&field1=<value>&field2=<value>
// @example:
// http://127.0.0.1:3000/input/ksdoLOZ99qpdL9gpOpaltuwe4Pt?private_key=PSsoE6nXcHN7xdp58vxsQbcoxxH&particles=1.2&no2=2.2
// http://139.162.208.52:3000/input/mTLUOAuw2rbQOQ4BuyOJESI5xmB?private_key=RuLvQs4ei5Ph3rrYWG0AhddM87k&particles=0&no2=2.5
router.get("/", log);
router.get("/:publicKey", log);
router.post("/:publicKey", log);

function log (req, res) {

    // Get values from request arguments
    var publicKey = req.params.publicKey;

    // The private key might come in the header or as a GET var depending on the method used for sending data.
    var privateKey = req.headers['dustbox-private-key'] ? req.headers['dustbox-private-key'] : req.query.private_key;

    // Strip out cruft
    delete req.query.private_key;

    var data = {};

    if (req.method === 'GET') {
        data = req.query;
    }

    if (req.method === 'POST') {
        data = req.body;
    }

    // Check for public key
    if (!publicKey) {
        res.set('Content-Type', 'application/json');
        return res.status(404).send('stream not found');
    }

    // Check for private key
    if (!privateKey) {
        res.set('Content-Type', 'application/json');
        return res.status(403).send('forbidden: missing private key');
    }

    // Make sure they sent some data.
    // Check if the array object is empty then don't update the model.
    // @ref: http://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
    if (Object.keys(data).length === 0 && data.constructor === Object) {
        res.set('Content-Type', 'application/json');
        return res.status(200).send('no data received');
    }

    // // Make sure they sent some data
    // if (!data || data.length === 0) {
    //     res.set('Content-Type', 'application/json');
    //     return res(400, 'no data received');
    // }

    var updateQuery = {};

    // Find stream by write API key
    // Send status code for each case : -1 if error, 0 if no stream found and 1 if update successful
    Stream.findOne({
        public_key:publicKey,
        private_key:privateKey
    }, function(err, stream) {

        if (err) {
            console.log("Error retrieving stream: " + err);
            return res.sendStatus(500); // equivalent to res.status(500).send('Internal Server Error')
        }

        if (stream === null) {
            console.log("Either no stream was found for this API key: " + privateKey + " or the stream doesn't have any variables set");
            res.set('Content-Type', 'application/json');
            return res.status(200).send('stream not found');
        }

        // Make sure the stream data (object) has keys in
        // http://stackoverflow.com/questions/4994201/is-object-empty
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
        if (!Object.keys(stream.data).length > 0) {
            res.set('Content-Type', 'application/json');
            return res.status(200).send('update failed');
        }

        // Build $push query with variables passed in POST request.
        // We check that the variable have already been registered otherwise they"ll be ignored.
        for (var property in stream.data) {
            if (data.hasOwnProperty(property) && stream.data.hasOwnProperty(property)) {
                updateQuery["data." + property] = data[property];
            } else {
                updateQuery["data." + property] = null;
            }
        }

        // Insert date data.
        updateQuery["data.timestamp"] = Date.now();

        // Update stream with new values and increment entries_number
        stream.update({
            $push: updateQuery,
            $inc: {entries_number: 1},
            last_entry_at: Date.now()
        }, function(err, streamID) {

            if (err) {
                console.log("Error updating stream: " + err);
                return res.sendStatus(-1);
            }

            console.log("New entry for stream with API key: " + privateKey);
            // res.sendStatus(200); // equivalent to res.status(200).send('OK')
            res.set('Content-Type', 'application/json');
            return res.status(200).send('success 1');
        });
    });
};

module.exports = router;

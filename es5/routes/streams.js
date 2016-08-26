var express = require('express');
var router = express.Router();

// Import dependencies.
var hat = require("hat");
var uid = require('rand-token').uid;
var mongoose = require("mongoose");

// Import rand-token.
// To generate tokens or api keys with crypto.randomBytes as the random source:
var crypto = require('crypto');
var randtoken = require('rand-token').generator({
    source: crypto.randomBytes
});

// Import the User schema and the authentication middleware.
var Stream = mongoose.model("Stream");
var helper = require("../utils");

// Views:
// GET streams page
router.get("/", function(req, res, next) {

    var errorMessage = req.session.error;
    var successMessage = req.session.success;
    var isAdmin = req.session.user ? true : false;

    // since messages have been served, delete from session
    delete req.session.error;
    delete req.session.success;

    var query = {
        hidden: '0'
    };
    if (req.session.user) {
        var sessionUserID = req.session.user._id;
        query = {
            user_id: sessionUserID
        };
    }

    var page = req.query.page === undefined ? 1 : req.query.page;
    var options = {
        page: page,
        limit: 30,
        sort: {
            created_at: 'desc'
        }
    };

    // https://github.com/edwardhotchkiss/mongoose-paginate
    Stream.paginate(query, options, function(err, result) {
        // result.docs
        // result.total
        // result.limit - 10
        // result.page - 3
        // result.pages
        if (err) {
            console.log("Error retrieving streams: " + err);
            errorMessage = "A problem occurred retrieving the streams";
            return res.render("streams", {
                streams: {},
                errorMessage: errorMessage
            });
        }

        return res.render("streams/list", {
            streams: result.docs,
            page: result.page,
            pages: result.pages,
            urlQuery:'streams?page=',
            errorMessage: errorMessage,
            successMessage: successMessage,
            isAdmin: isAdmin
        });
    });

    // http://stackoverflow.com/questions/20846001/how-results-pagination-works-with-node-js-jade-mongoose-and-bootstrap
    // http://madhums.me/2012/08/20/pagination-using-mongoose-express-and-jade/
    // .find({}).sort('mykey', 1).skip(from).limit(to)
    // // Find streams documents owned by the current session user
    // Stream.find(options, function(err, streams) {

    //     if (err) {
    //         console.log("Error retrieving streams: " + err);
    //         errorMessage = "A problem occurred retrieving the streams";
    //         return res.render("streams", {
    //             streams: {},
    //             errorMessage: errorMessage
    //         });
    //     }

    //     return res.render("streams/list", {
    //         streams: streams,
    //         errorMessage: errorMessage,
    //         successMessage: successMessage,
    //         isAdmin: isAdmin
    //     });
    // })
    // .limit(10)
    // .sort({
    //     created_at: 'desc'
    // });
});

// GET make stream page
router.get("/make", helper.authenticate, function(req, res) {

    var errorMessage = req.session.error;
    var successMessage = req.session.success;

    // since messages have been served, delete from session
    delete req.session.error;
    delete req.session.success;

    var isAdmin = req.session.user ? true : false;

    return res.render("streams/make", {
        isAdmin: isAdmin,
        "errorMessage": errorMessage,
        "successMessage": successMessage
    });
});

// GET stream alias
router.get("/alias-search", helper.authenticate, function(req, res) {

    var query = req.query;
    var options = {
        alias: query.search_keyword
    };

    if (query.exclude) {
        options = {
            alias: query.search_keyword,
            $and: [{_id:{$ne : query.exclude}}]
        };
    }

    // Find stream by publicKey
    // Exclude self.
    // https://docs.mongodb.com/manual/reference/operator/query/and/#op._S_and
    Stream.findOne(options, function(err, stream) {

        var output = {};
        if (err) {
            console.log("Error retrieving streams: " + err);
            output = {"message": err};
        }

        if (!stream) {
            console.log("No stream found");
            output = {"message": "OK"};
        }

        if (stream) {
            console.log("Stream found");
            output = {"message": "Alias exists!"};
        }

        res.set('Content-Type', 'application/json');
        return res.status(200).json(output);
    });
});

// GET stream keys page
// @format:
// http://127.0.0.1:8080/streams/<public_key>/keys/<id>
// @example:
// http://127.0.0.1:3000/streams/ksdoLOZ99qpdL9gpOpaltuwe4Pt/keys/PSsoE6nXcHN7xdp58vxsQbcoxxH
router.get("/:publicKey/keys/:_id", helper.authenticate, function(req, res) {

    var publicKey = req.params.publicKey;
    var _id = req.params._id;
    var isAdmin = req.session.user ? true : false;

    // Find stream by publicKey
    Stream.findOne({
        public_key: publicKey,
        _id: _id
    }, function(err, stream) {

        if (err) {
            console.log("Error retrieving streams: " + err);
            req.session.error = "Error retrieving the stream.";
            return res.redirect("/streams/" + publicKey);
        }

        if (!stream) {
            req.session.error = "ID is not valid.";
            return res.redirect("/streams/" + publicKey);
        }

        var mixedStream = stream;
        mixedStream.public_url =  req.protocol + '://' + req.get('host') + '/streams/' + stream.public_key;
        return res.render("streams/keys", {
            "stream": mixedStream,
            "isAdmin": isAdmin
        });
    });
});

// GET edit stream page
// @format:
// http://127.0.0.1:8080/streams/<public_key>/edit/<private_key>
// @example:
// http://127.0.0.1:3000/streams/ksdoLOZ99qpdL9gpOpaltuwe4Pt/edit/PSsoE6nXcHN7xdp58vxsQbcoxxH
router.get("/:publicKey/edit/:privateKey", function(req, res) {

    var publicKey = req.params.publicKey;
    var privateKey = req.params.privateKey;
    var isAdmin = req.session.user ? true : false;

    var errorMessage = req.session.error;
    var successMessage = req.session.success;

    // since messages have been served, delete from session
    delete req.session.error;
    delete req.session.success;

    // Find stream by publicKey
    Stream.findOne({
        public_key: publicKey,
        private_key: privateKey
    }, function(err, stream) {

        if (err) {
            console.log("Error retrieving streams: " + err);
            req.session.error = "Error retrieving the stream.";
            return res.redirect("/streams/" + publicKey);
        }

        if (!stream) {
            req.session.error = "Private key is not valid.";
            return res.redirect("/streams/" + publicKey);
        }

        return res.render("streams/manage", {
            "stream": stream,
            "isAdmin": isAdmin,
            "errorMessage": errorMessage,
            "successMessage": successMessage
        });
    });
});

// POST edit stream page
// @format:
// http://127.0.0.1:8080/streams/<public_key>
// @example:
// http://127.0.0.1:3000/streams/ksdoLOZ99qpdL9gpOpaltuwe4Pt
router.post("/:publicKey", function(req, res) {

    var publicKey = req.body.public_key;
    var privateKey = req.body.private_key;
    var isAdmin = req.session.user ? true : false;

    // Find stream by publicKey
    Stream.findOne({
        public_key: publicKey,
        private_key: privateKey
    }, function(err, stream) {

        if (err) {
            console.log("Error retrieving streams: " + err);
            req.session.error = "Error retrieving the stream.";
            return res.redirect("/streams/" + publicKey);
        }

        if (!stream) {
            req.session.error = "Private key is not valid.";
            return res.redirect("/streams/" + publicKey);
        }

        return res.redirect("/streams/" + publicKey + '/edit/' + privateKey);
    });
});

// GET request to retrieve a stream data.
// @format:
// http://127.0.0.1:8080/streams/<public_key>
// @example:
// http://127.0.0.1:8080/streams/kYq3g0kgBes3mY2lqAJLUgpVKXM1
router.get("/:publicKey", function(req, res) {

    var errorMessage = req.session.error;
    var successMessage = req.session.success;

    // since messages have been served, delete from session
    delete req.session.error;
    delete req.session.success;

    var isAdmin = req.session.user ? true : false;
    var publicKey = req.params.publicKey;

    // Find stream by publicKey
    Stream.findOne({
        public_key: publicKey
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
            urlQuery:'streams/' + publicKey + '?page=',
            isAdmin: isAdmin,
            errorMessage: errorMessage,
            successMessage: successMessage
        });
    });
});

// Gateways:
// POST request to create a new stream.
router.post("/", helper.authenticate, function(req, res) {

    // Used to set the stream owner
    var sessionUserID = req.session.user._id;

    // Get values from the post request
    var title = req.body.title;
    var description = req.body.description;
    var device_number = req.body.device_number;
    var species = req.body.species;
    var alias = req.body.alias;
    var location = req.body.location;
    var hidden = req.body.hidden;

    // Convert string: 'field1, field2, field3'
    // into an array: ['field1, field2, field3']
    var tags = req.body.tags ? req.body.tags.split(',') : [];

    // Convert object to array.
    // example from:
    // { '0': { public_name: 'a', code_name: 'b' },
    // '1469429429493': { public_name: 'c', code_name: 'd' } }
    // to:
    // [ { public_name: 'a', code_name: 'b' },
    // { public_name: 'c', code_name: 'd' } ]
    // http://stackoverflow.com/questions/6857468/converting-a-js-object-to-an-array
    var speciesArray = Object.keys(species).map(function (key) {
        return species[key];
    });

    // This is so that we can loop through the object in reverse order
    // We do that so that the fields are saved in the right order on the db
    // (this way it will appear in the right order on the 'edit' view)
    var fields = speciesArray.reverse();
    var dataFields = {};
    if (speciesArray.length > 0) {
        // Add timestamp to the fields.
        dataFields['timestamp'] = [];
        // Create data fields.
        fields.forEach(function(field, index) {
            dataFields[field.code_name] = []
        });
    }

    // Don't proceed if the alias is less than 3 letters.
    if (alias.length < 3) {
        req.session.error = "Alias must be at least 3 letters.";
        return res.redirect("/streams/make");
    } else {
        // Find stream by alias
        var options = {
            alias: alias
        };

        Stream.findOne(options, function(err, stream) {

            if (err) {
                req.session.error = "Create failed: " + err;
                return res.redirect("/streams/make");
            }

            if (stream) {
                req.session.error = alias + " - this alias is in use by another stream.";
                return res.redirect("/streams/make");
            }

            if (!stream) {
                // Create stream
                Stream.create({
                    user_id: sessionUserID,
                    title: title,
                    device_number: device_number,
                    description: description,
                    public_key: randtoken.generate(27),
                    private_key: randtoken.generate(27),
                    delete_key: randtoken.generate(27),
                    hidden: hidden,
                    species: speciesArray.reverse(),
                    tags: tags,
                    location: location,
                    alias: alias,
                    data: dataFields
                }, function(err, stream) {

                    if (err) {
                        console.log("Error creating the stream: " + err);
                        req.session.error = "A problem occured when creating the stream: " + err;
                        return res.redirect("/streams/make");
                    }

                    console.log("New stream created with id: " + stream._id);
                    req.session.success = "Stream '" + title + "' created successfully.";
                    return res.redirect("/streams");
                });
            }
        });
    }
});

// PUT request to update a stream.
// @format:
// http://127.0.0.1:8080/streams/<public_key>
// @example:
// http://127.0.0.1:3000/streams/ksdoLOZ99qpdL9gpOpaltuwe4Pt
router.put("/:publicKey/update/:privateKey", function(req, res) {

    // Get values from params.
    var publicKey = req.params.publicKey;
    var privateKey = req.params.privateKey;

    // Get values from the POST request.
    var _id = req.body._id;
    var title = req.body.title;
    var description = req.body.description;
    var device_number = req.body.device_number;
    var species = req.body.species;
    var alias = req.body.alias;
    var location = req.body.location;
    var hidden = req.body.hidden;

    // Convert string: 'field1, field2, field3'
    // into an array: ['field1, field2, field3']
    var tags = req.body.tags ? req.body.tags.split(',') : [];

    var reset = false;
    var ok = false;
    var setList = {};
    var unsetList = {};
    var updateQuery = {};

    // Don't proceed if the alias is less than 3 letters.
    if (alias.length < 3) {
        req.session.error = "Alias must be at least 3 letters.";
        return res.redirect("/streams/" + publicKey + "/edit/" + privateKey);
    } else {

        // http://www.html5rocks.com/en/tutorials/es6/promises/
        var promise = new Promise(function(resolve, reject) {
            // do a thing, possibly async, then…
            // Find stream by alias
            // Exclude self.
            var options = {
                alias: alias,
                $and: [{_id:{$ne : _id}}]
            };
            Stream.findOne(options, function(err, stream) {

                // Error occurs.
                if (err) {
                    reject(Error(err));
                }

                // If the alias already taken in other stream.
                if (stream) {
                    resolve(false);
                }

                // Not yet taken.
                if (!stream) {
                    resolve(true);
                } else {
                    reject(Error(false));
                }

            });
        });

        promise.then(function(result) {

            // Stop here if it is false.
            if (result === false) {
                req.session.error = alias + " - this alias is in use by another stream.";
                return res.redirect("/streams/" + publicKey + "/edit/" + privateKey);
            }

            // Find stream by publicKey
            Stream.findOne({
                public_key: publicKey,
                private_key: privateKey
            }, function(err, stream) {

                updateQuery = {
                    title: title,
                    device_number: device_number,
                    description: description,
                    hidden: hidden,
                    tags: tags,
                    location: location,
                    alias: alias
                };

                // Convert object to array.
                // example from:
                // { '0': { public_name: 'a', code_name: 'b' },
                // '1469429429493': { public_name: 'c', code_name: 'd' } }
                // to:
                // [ { public_name: 'a', code_name: 'b' },
                // { public_name: 'c', code_name: 'd' } ]
                // http://stackoverflow.com/questions/6857468/converting-a-js-object-to-an-array
                var speciesArray = Object.keys(species).map(function (key) {
                    return species[key];
                });

                // Compare the length, if not match, must have added or removed items.
                if (speciesArray.length !== stream.species.length) {
                    reset = true;
                }

                // Compare the length, if same length, compare data.
                var mismatch = 0;
                if (speciesArray.length === stream.species.length) {
                    // Filter those that do not match and check whether there are any.
                    // If it does, than you assign true to reset
                    mismatch = speciesArray.filter(function(field, index) {
                        return stream.species[index].code_name !== field.code_name
                            || stream.species[index].public_name !== field.public_name
                    });

                }
                if (mismatch.length > 0) {
                    reset = true;
                }

                // If there is a change in the fields input, then unset then re-set the list.
                if (reset === true) {

                    // Create unset list to remove it from the db.
                    for (var field in stream.data) {
                        unsetList["data." + field] = true;
                    }

                    if (speciesArray.length > 0) {
                        // Create data fields.
                        speciesArray.forEach(function(field, index) {
                            setList["data." + field.code_name] = []
                        });
                        // Add timestamp to the fields.
                        setList["data." + "timestamp"] = [];
                    }

                    // Add all fields to updateQuery to unset.
                    updateQuery["$unset"] = unsetList;

                    // Update the species.
                    updateQuery["species"] = speciesArray;
                    updateQuery["entries_number"] = 0;

                    // Update stream by unsetting all existing fields.
                    stream.update(updateQuery, function(err, streamID) {
                        if (err) {
                            req.session.error = "Update failed: " + err;
                        }
                    });

                    // Delete the key after the update.
                    delete updateQuery["$unset"];

                    // Add all fields to updateQuery to reset.
                    // mongo <= 2.4:
                    // updateQuery["data"] = setList;
                    // mongo > 2.4:
                    updateQuery["$set"] = setList;
                    // The fields in a document are reordered (sorted alphabetically) when setting a field value.
                    // http://stackoverflow.com/questions/22904167/mongo-db-update-changing-the-order-of-object-fields
                    // http://stackoverflow.com/questions/38090771/mongoose-mongo-why-does-set-auto-sort-the-data-keys-on-update
                    // https://jira.mongodb.org/browse/SERVER-2592
                }

                // Update stream
                stream.update(updateQuery, { new: true }, function(err, result) {
                    if (err) {
                        req.session.error = "Update failed: " + err;
                        return res.redirect("/streams/" + publicKey);
                    }

                    req.session.success = "Update successful.";
                    return res.redirect("/streams/" + publicKey);
                });
            });
        }, function(err) {
            req.session.error = "Update failed: " + err;
            return res.redirect("/streams/" + publicKey + "/edit/" + privateKey);
        });
    }
});

// PUT request to clear a stream data.
router.put("/:publicKey/clear/:privateKey", function(req, res) {

    var privateKey = req.params.privateKey;
    var publicKey = req.params.publicKey;
    var isAdmin = req.session.user ? true : false;

    var updateQuery = {};
    var setList = {};

    // Find stream by publicKey
    Stream.findOne({
        public_key: publicKey,
        private_key: privateKey
    }, function(err, stream) {

        if (err) {
            console.log("Error retrieving the stream: " + err);
            req.session.error = "A problem occurred retrieving the stream.";
            return res.redirect("/streams/" + publicKey + '/edit/' + privateKey);
        }

        // Create unset list to remove it from the db.
        for (var field in stream.data) {
            setList["data." + field] = [];
        }

        updateQuery["$set"] = setList;

        // Update stream
        stream.update(updateQuery, { new: true }, function(err, streamID) {

            if (err) {
                console.log("Error updating stream: " + err);
                req.session.error = "Update failed, please try again.";
                return res.redirect("/streams/" + publicKey + '/edit/' + privateKey);
            }

            console.log("Update on stream: " + streamID);
            req.session.success = "Data cleared successful.";
            return res.redirect("/streams/" + publicKey + '/edit/' + privateKey);
        });
    });
});

// DELETE request to drop a stream.
router.delete("/:publicKey/delete/:privateKey", helper.authenticate, function(req, res) {

    var privateKey = req.params.privateKey;
    var publicKey = req.body.public_key;
    var deleteKey = req.body.delete_key;
    var isAdmin = req.session.user ? true : false;

    // Find stream by publicKey
    Stream.findOne({
        public_key: publicKey,
        delete_key: deleteKey
    }, function(err, stream) {

        if (err) {
            console.log("Error retrieving the stream: " + err);
            req.session.error = "A problem occurred retrieving the stream.";
            return res.redirect("/streams/" + publicKey + '/edit/' + privateKey);
        }

        if (!stream) {
            req.session.error = "Delete key is not valid.";
            return res.redirect("/streams/" + publicKey + '/edit/' + privateKey);
        }

        // Remove stream document
        stream.remove(function(err, stream) {

            if (err) {
                console.log("Error deleting stream: " + err);
                req.session.error("A problem occured deleting the stream. Please try again.");
                return res.redirect("/streams");
            }

            console.log("Deleted stream with id: " + stream._id);
            req.session.success = "Successfully deleted stream '" + stream.title + "'";
            return res.redirect("/streams");
        });
    });
});

module.exports = router;

var mongoose = require("mongoose");
var mongoosePaginate = require('mongoose-paginate');

// Declare schema
var streamSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    public_key: {
        type: String
    },
    private_key: {
        type: String
    },
    delete_key: {
        type: String
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    hidden:{
        type: String
    },
    device_number: {
        type: String
    },
    // alias:{
    //     type: String,
    //     index: {
    //         unique: true
    //     }
    // },
    alias:{
        type: String
    },
    species: {
        type: Array
    },
    data: {
        type: Object
    },
    tags: {
        type: Array
    },
    location: {
        type: Object
    },
    entries_number: {
        type: Number,
        default: 0
    },
    last_entry_at: {
        type: Date
    },
    created_at: {
        type: Date,
        default: Date.now
    },
});

streamSchema.plugin(mongoosePaginate);

// Export schema
// Model.paginate()
mongoose.model("Stream", streamSchema);

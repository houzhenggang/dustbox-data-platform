var mongoose = require("mongoose");

// Declare schema
var speciesSchema = new mongoose.Schema({
    code_name: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    public_name: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

// <span class="glyphicon glyphicon-cloud"></span>

// Export schema
mongoose.model("Species", speciesSchema);

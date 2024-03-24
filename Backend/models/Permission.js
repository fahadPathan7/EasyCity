// external imports
const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema({
    permissionName: {
        type: String,
        unique: true,
        required: true
    },
    permissionDescription: {
        type: String,
        required: true
    }
});

const Permission = mongoose.model("Permission", permissionSchema);

module.exports = Permission;
// external imports
const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    roleID: {
        type: Number,
        required: true,
    },
    roleName: {
        type: String,
        required: true,
    },
    permissions: [
        {
            type: String,
        }
    ] // array of permission IDs
},);

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
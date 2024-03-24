const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    mobile: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    roleID: {
        type: Number,
        enum: [1, 2, 3, 4],
        default: 4
    },
},
{
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;
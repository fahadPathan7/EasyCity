const mongoose = require('mongoose');

const userDocumentSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    }
},
{
    timestamps: true
});

const UserDocument = mongoose.model('UserDocument', userDocumentSchema);

module.exports = UserDocument;
const mongoose = require('mongoose');

const StsSchema = new mongoose.Schema({
    stsID: {
        type: String,
        required: true,
        unique: true
    },
    wardNumber: {
        type: Number,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    volumeOfWaste: {
        type: Number,
        default: 0
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    stsManagers: [
        {
            type: String,
        }
    ],
    vehicleNumbers: [
        {
            type: String,
        }
    ]
});

const Sts = mongoose.model('Sts', StsSchema);

module.exports = Sts;
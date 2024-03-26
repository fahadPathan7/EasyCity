const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
    vehicleNumber: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    volumeOfWaste: {
        type: Number
    },
    stsID: {
        type: String
    },
    timeOfArrivalSts: {
        type: Date
    },
    timeOfDepartureSts: {
        type: Date,
    },
    landfillID: {
        type: String
    },
    timeOfArrivalLandfill: {
        type: Date
    },
    timeOfDepartureLandfill: {
        type: Date
    },
});

const Vehicle = mongoose.model('Vehicle', VehicleSchema);

module.exports = Vehicle;
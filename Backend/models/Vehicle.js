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
    fullyLoadedCost: {
        type: Number,
        required: true
    },
    unloadedCost: {
        type: Number,
        required: true
    },
    stsID: {
        type: String
    },
    timeOfArrivalSts: {
        type: String
    },
    timeOfDepartureSts: {
        type: String,
    },
    landfillID: {
        type: String
    },
    timeOfArrivalLandfill: {
        type: String
    },
    timeOfDepartureLandfill: {
        type: String
    },
});

const Vehicle = mongoose.model('Vehicle', VehicleSchema);

module.exports = Vehicle;
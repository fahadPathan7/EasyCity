const moongose = require('mongoose');

const BillSchema = new moongose.Schema({
    billID: {
        type: String,
        required: true,
        unique: true
    },
    vehicleNumber: {
        type: String,
        required: true
    },
    stsID: {
        type: String,
        required: true
    },
    landfillID: {
        type: String,
        required: true
    },
    responsibleLandfillManager: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
    },
    volumeOfWaste: {
        type: Number,
    },
    timeOfDepartureSts: {
        type: String,
        required: true
    },
    timeOfArrivalLandfill: {
        type: String,
        required: true
    },
    costPerKilometerToLandfill: {
        type: Number,
        required: true
    },
    costPerKilometerToBackToSts: {
        type: Number,
        required: true
    },
    twoWayDistance: {
        type: Number,
        required: true
    },
    totalCost: {
        type: Number,
        required: true
    }
},
{
    timestamps: true
});

const Bill = moongose.model('Bill', BillSchema);

module.exports = Bill;
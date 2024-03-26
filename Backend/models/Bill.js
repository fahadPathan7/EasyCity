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
    timeOfDepartureSts: {
        type: Date,
        required: true
    },
    timeOfArrivalLandfill: {
        type: Date,
        required: true
    },
    allocatedOil: {
        type: Number,
        required: true
    },
    billingDate: {
        type: Date,
        required: true
    },
},
{
    timestamps: true
});
const moongose = require('mongoose');

const LandfillSchema = new moongose.Schema({
    landfillID: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    volumeOfWaste: {
        type: Number,
        default: 0
    },
    operationalTimespan: {
        type: String,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    landfillManagers: [
        {
            type: String,
        }
    ]
});

const Landfill = moongose.model('Landfill', LandfillSchema);

module.exports = Landfill;
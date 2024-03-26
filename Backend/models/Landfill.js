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
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    landfillManager: {
        type: String
    }
});

const Landfill = moongose.model('Landfill', LandfillSchema);

module.exports = Landfill;
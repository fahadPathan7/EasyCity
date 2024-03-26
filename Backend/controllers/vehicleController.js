// external imports
const createError = require('http-errors');

// internal imports
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');

// add new vehicle
const addNewVehicle = async (req, res, next) => {
    try {
        // check if vehicle already exists
        const vehicle = await Vehicle.findOne({
            vehicleNumber: req.body.vehicleNumber
        });

        if (vehicle) {
            return next(createError(400, 'Vehicle already exists.'));
        }

        // create new vehicle
        const newVehicle = new Vehicle({
            vehicleNumber: req.body.vehicleNumber,
            type: req.body.type,
            capacity: req.body.capacity,
            volumeOfWaste: req.body.volumeOfWaste,
            stsID: req.body.stsID,
            timeOfArrivalSts: req.body.timeOfArrivalSts,
            timeOfDepartureSts: req.body.timeOfDepartureSts,
            landfillID: req.body.landfillID,
            timeOfArrivalLandfill: req.body.timeOfArrivalLandfill,
            timeOfDepartureLandfill: req.body.timeOfDepartureLandfill
        });

        // save vehicle
        await newVehicle.save();

        res.status(201).json({
            message: 'Vehicle added successfully.'
        });

    } catch (error) {
        next(error);
    }
}

// export
module.exports = {
    addNewVehicle
};

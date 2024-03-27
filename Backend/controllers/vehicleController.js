// external imports
const createError = require('http-errors');

// internal imports
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');
const Sts = require('../models/Sts');

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

// update vehicle stsID, timeOfArrivalSts, timeOfDepartureSts, volumeOfWaste
const updateVehicleSts = async (req, res, next) => {
    try {
        // find vehicle
        const vehicle = await Vehicle.findOne({
            vehicleNumber: req.body.vehicleNumber
        });

        if (!vehicle) {
            return next(createError(404, 'Vehicle not found.'));
        }

        // stsID will be found from the sts table. and where the managerID is the same as the user who is updating the vehicle.
        const sts = await Sts.findOne({
            managerID: req.user.id
        });

        if (!sts) {
            return next(createError(404, 'User is not a manager of any STS.'));
        }

        // update vehicle
        vehicle.stsID = sts.stsID;
        vehicle.timeOfArrivalSts = req.body.timeOfArrivalSts;
        vehicle.timeOfDepartureSts = req.body.timeOfDepartureSts;
        vehicle.volumeOfWaste = req.body.volumeOfWaste;

        // save vehicle
        await vehicle.save();

        //: create a bill and show the path to the landfill

        res.status(200).json({
            message: 'Vehicle updated successfully.'
        });

    } catch (error) {
        next(error);
    }
}

// export
module.exports = {
    addNewVehicle
};

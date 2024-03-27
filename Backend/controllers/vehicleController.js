// external imports
const createError = require('http-errors');

// internal imports
const Vehicle = require('../models/Vehicle');
const Sts = require('../models/Sts');
const Landfill = require('../models/Landfill');

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
            vehicleNumber: req.params.vehicleNumber
        });

        if (!vehicle) {
            return next(createError(404, 'Vehicle not found.'));
        }

        // i will find the sts with loggedin user.userID in the stsManagers array
        const sts = await Sts.findOne({
            stsManagers: req.user.userID
        });

        if (!sts) {
            return next(createError(404, 'User is not a manager of any STS.'));
        }

        // check if vehicle number is in the vehicleNumbers array of sts
        if (!sts.vehicleNumbers.includes(vehicle.vehicleNumber)) {
            return next(createError(400, 'Vehicle is not assigned to this STS.'));
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

// update vehicle landfillID, timeOfArrivalLandfill, timeOfDepartureLandfill
const updateVehicleLandfill = async (req, res, next) => {
    try {
        // find vehicle
        const vehicle = await Vehicle.findOne({
            vehicleNumber: req.params.vehicleNumber
        });

        if (!vehicle) {
            return next(createError(404, 'Vehicle not found.'));
        }

        // i will find the landfill with loggedin user.userID in the landfillManagers array
        const landfill = await Landfill.findOne({
            landfillManagers: req.user.userID
        });

        if (!landfill) {
            return next(createError(404, 'User is not a manager of any landfill.'));
        }

        // update vehicle
        vehicle.landfillID = landfill.landfillID;
        vehicle.timeOfArrivalLandfill = req.body.timeOfArrivalLandfill;
        vehicle.timeOfDepartureLandfill = req.body.timeOfDepartureLandfill;

        // save vehicle
        await vehicle.save();

        res.status(200).json({
            message: 'Vehicle updated successfully.'
        });

    } catch (error) {
        next(error);
    }
}

// export
module.exports = {
    addNewVehicle,
    updateVehicleSts,
    updateVehicleLandfill
};

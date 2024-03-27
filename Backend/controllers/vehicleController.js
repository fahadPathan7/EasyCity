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
            fullyLoadedCost: req.body.fullyLoadedCost,
            unloadedCost: req.body.unloadedCost
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

        // volume of waste should be less than or equal to capacity of vehicle
        if (req.body.volumeOfWaste > vehicle.capacity) {
            return next(createError(400, 'Volume of waste should be less than or equal to capacity of vehicle.'));
        }

        // if timeOfArrivalSts and timeOfDepartureSts is not null, then the vechicle did not leave the landfill
        if (vehicle.timeOfArrivalSts && vehicle.timeOfDepartureSts) {
            return next(createError(400, 'Vehicle is on the way to landfill.'));
        }

        // update vehicle
        // vehicle.stsID = sts.stsID;
        vehicle.timeOfArrivalSts = req.body.timeOfArrivalSts;
        vehicle.timeOfDepartureSts = req.body.timeOfDepartureSts;
        vehicle.volumeOfWaste = req.body.volumeOfWaste;

        // reset the timeOfArrivalLandfill, timeOfDepartureLandfill
        vehicle.landfillID = null;
        vehicle.timeOfArrivalLandfill = null;
        vehicle.timeOfDepartureLandfill = null;

        // save vehicle
        await vehicle.save();

        //: create a bill and show the path to the landfill

        res.status(200).json({
            message: 'Vehicle info updated successfully.'
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

        // if timeOfArrivalSts and timeOfDepartureSts is not set, then the vehicle cannot be assigned to landfill
        if (!vehicle.timeOfArrivalSts || !vehicle.timeOfDepartureSts) {
            return next(createError(400, 'Vehicle is still in STS.'));
        }

        // if timeOfArrivalLandfill and timeOfDepartureLandfill is not null, then the vechicle is on the way to sts
        if (vehicle.timeOfArrivalLandfill && vehicle.timeOfDepartureLandfill) {
            return next(createError(400, 'Vehicle is on the way to STS.'));
        }

        // update vehicle
        vehicle.landfillID = landfill.landfillID;
        vehicle.timeOfArrivalLandfill = req.body.timeOfArrivalLandfill;
        vehicle.timeOfDepartureLandfill = req.body.timeOfDepartureLandfill;

        // reset the timeOfArrivalSts, timeOfDepartureSts, volumeOfWaste
        vehicle.timeOfArrivalSts = null;
        vehicle.timeOfDepartureSts = null;
        vehicle.volumeOfWaste = null;

        // save vehicle
        await vehicle.save();

        res.status(200).json({
            message: 'Vehicle info updated successfully.'
        });

    } catch (error) {
        next(error);
    }
}

// get all vehicles which are not assigned to any sts
const getAllUnassignedVehicles = async (req, res, next) => {
    try {
        const vehicles = await Vehicle.find({
            stsID: null
        }).select('-_id -__v -stsID -timeOfArrivalSts -timeOfDepartureSts -landfillID -timeOfArrivalLandfill -timeOfDepartureLandfill -volumeOfWaste');

        res.status(200).json({
            vehicles
        });

    } catch (error) {
        next(error);
    }
}

// get all vehicles
const getAllVehicles = async (req, res, next) => {
    try {
        const vehicles = await Vehicle.find().select('-_id -__v -timeOfArrivalSts -timeOfDepartureSts -landfillID -timeOfArrivalLandfill -timeOfDepartureLandfill -volumeOfWaste');

        res.status(200).json({
            vehicles
        });

    } catch (error) {
        next(error);
    }
}

// get specific vehicle
const getAVehicle = async (req, res, next) => {
    try {
        const vehicle = await Vehicle.findOne({
            vehicleNumber: req.params.vehicleNumber
        }).select('-_id -__v -timeOfArrivalSts -timeOfDepartureSts -landfillID -timeOfArrivalLandfill -timeOfDepartureLandfill -volumeOfWaste');

        if (!vehicle) {
            return next(createError(404, 'Vehicle not found.'));
        }

        res.status(200).json({
            vehicle
        });

    } catch (error) {
        next(error);
    }
}

// export
module.exports = {
    addNewVehicle,
    updateVehicleSts,
    updateVehicleLandfill,
    getAllUnassignedVehicles,
    getAllVehicles,
    getAVehicle
};

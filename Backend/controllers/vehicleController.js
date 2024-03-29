// external imports
const createError = require('http-errors');

// internal imports
const Vehicle = require('../models/Vehicle');
const Sts = require('../models/Sts');
const Landfill = require('../models/Landfill');
const Bill = require('../models/Bill');

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

        // check if data is provided for each field separately. timeOfArrivalSts, timeOfDepartureSts are strings and volumeOfWaste is number
        if (!req.body.timeOfArrivalSts || !req.body.timeOfDepartureSts || !req.body.volumeOfWaste) {
            return next(createError(400, 'Please provide timeOfArrivalSts, timeOfDepartureSts and volumeOfWaste.'));
        }

        // check if volumeOfWaste is not greater than capacity
        if (req.body.volumeOfWaste > vehicle.capacity) {
            return next(createError(400, 'Volume of waste should be less than or equal to capacity of vehicle.'));
        }

        // update vehicle
        // vehicle.stsID = sts.stsID;
        vehicle.timeOfArrivalSts = req.body.timeOfArrivalSts;
        vehicle.timeOfDepartureSts = req.body.timeOfDepartureSts;
        vehicle.volumeOfWaste = req.body.volumeOfWaste;

        // reset the timeOfArrivalLandfill, timeOfDepartureLandfill
        vehicle.timeOfArrivalLandfill = null;
        vehicle.timeOfDepartureLandfill = null;

        // save vehicle
        await vehicle.save();

        res.status(200).json({
            message: 'Vehicle info updated successfully.'
        });

    } catch (error) {
        next(error);
    }
}

// update vehicle landfillID, timeOfArrivalLandfill, timeOfDepartureLandfill
// haversine formula to calculate distance between two points
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  }

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

// controller to update timeOfArrivalLandfill, timeOfDepartureLandfill
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

        // check if vehicle number is in the vehicleNumbers array of landfill
        if (!landfill.vehicleNumbers.includes(vehicle.vehicleNumber)) {
            return next(createError(400, 'Vehicle is not assigned to this landfill.'));
        }

        // if timeOfArrivalSts and timeOfDepartureSts is not set, then the vehicle cannot be assigned to landfill
        if (!vehicle.timeOfArrivalSts || !vehicle.timeOfDepartureSts) {
            return next(createError(400, 'Vehicle is still in STS.'));
        }

        // if timeOfArrivalLandfill and timeOfDepartureLandfill is not null, then the vechicle is on the way to sts
        if (vehicle.timeOfArrivalLandfill && vehicle.timeOfDepartureLandfill) {
            return next(createError(400, 'Vehicle is on the way to STS.'));
        }

        // check if data is provided for each field separately. timeOfArrivalLandfill, timeOfDepartureLandfill are strings
        if (!req.body.timeOfArrivalLandfill || !req.body.timeOfDepartureLandfill) {
            return next(createError(400, 'Please provide timeOfArrivalLandfill and timeOfDepartureLandfill.'));
        }

        // update vehicle landfillID, timeOfArrivalLandfill, timeOfDepartureLandfill
        vehicle.timeOfArrivalLandfill = req.body.timeOfArrivalLandfill;
        vehicle.timeOfDepartureLandfill = req.body.timeOfDepartureLandfill;

        // generate billID of 10 characters
        const billID = "B" + Math.random().toString(36).substr(2, 10);
        // calculate distance between sts and landfill
        // find the sts of the vehicle
        const sts = await Sts.findOne({
            stsID: vehicle.stsID
        });
        // get the distance between sts and landfill
        const distanceTravelled = getDistanceFromLatLonInKm(sts.latitude, sts.longitude, landfill.latitude, landfill.longitude);
        // calculate cost
        const costPerKilometerToLandfill = vehicle.unloadedCost + (vehicle.fullyLoadedCost - vehicle.unloadedCost) * parseFloat(vehicle.volumeOfWaste / vehicle.capacity);
        const costPerKilometerToBackToSts = vehicle.unloadedCost;
        const totalCost = (costPerKilometerToLandfill + costPerKilometerToBackToSts) * distanceTravelled;
        const bill = {
            billID: billID,
            vehicleNumber: vehicle.vehicleNumber,
            stsID: vehicle.stsID,
            landfillID: vehicle.landfillID,
            responsibleLandfillManager: req.user.userID, // logged in user
            capacity: vehicle.capacity,
            volumeOfWaste: vehicle.volumeOfWaste,
            timeOfDepartureSts: vehicle.timeOfDepartureSts,
            timeOfArrivalLandfill: vehicle.timeOfArrivalLandfill,
            costPerKilometerToLandfill: costPerKilometerToLandfill,
            costPerKilometerToBackToSts: costPerKilometerToBackToSts,
            twoWayDistance: distanceTravelled * 2,
            totalCost: totalCost
        }
        // save bill
        const newBill = new Bill(bill);
        await newBill.save();

        // update landfill volumeOfwaste
        landfill.volumeOfWaste = landfill.volumeOfWaste + vehicle.volumeOfWaste;
        await landfill.save();

        // reset the timeOfArrivalSts, timeOfDepartureSts, volumeOfWaste
        vehicle.timeOfArrivalSts = null;
        vehicle.timeOfDepartureSts = null;
        vehicle.volumeOfWaste = null;

        // save vehicle
        await vehicle.save();

        // send message and billID
        res.status(200).json({
            message: 'Vehicle info updated successfully.',
            billID: billID
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
        const vehicles = await Vehicle.find().select('-_id -__v -timeOfArrivalSts -timeOfDepartureSts -timeOfArrivalLandfill -timeOfDepartureLandfill -volumeOfWaste');

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
        }).select('-_id -__v -timeOfArrivalSts -timeOfDepartureSts -timeOfArrivalLandfill -timeOfDepartureLandfill -volumeOfWaste');

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

// get the vehicles which are available in the sts
const getVehiclesInSts = async (req, res, next) => {
    try {
        // get the sts of the logged in user
        const sts = await Sts.findOne({
            stsManagers: req.user.userID
        });

        if (!sts) {
            return next(createError(404, 'User is not a manager of any STS.'));
        }

        // get the vehicles which have the stsID of this sts and timeOfArrivalSts and timeOfDepartureSts is null
        const vehicles = await Vehicle.find({
            stsID: sts.stsID,
            timeOfArrivalSts: null,
            timeOfDepartureSts: null
        }).select('-_id -__v -timeOfArrivalSts -timeOfDepartureSts -timeOfArrivalLandfill -timeOfDepartureLandfill -volumeOfWaste');

        // now check the bills. if the vehicle has 3 bills on that day, then the vehicle is not available.
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const bills = await Bill.find({
            vehicleNumber: { $in: vehicles.map(vehicle => vehicle.vehicleNumber) },
            createdAt: { $gte: startOfDay, $lt: endOfDay }
        });

        // filter out the vehicles which have 3 bills
        const availableVehicles = vehicles.filter(vehicle => {
            const count = bills.filter(bill => bill.vehicleNumber === vehicle.vehicleNumber).length;
            return count < 3;
        });

        res.status(200).json({
            vehicles: availableVehicles
        });

    } catch (error) {
        next(error);
    }
}

// get the vehicles which are available in the landfill
const getVehiclesInLandfill = async (req, res, next) => {
    try {
        // get the landfill of the logged in user
        const landfill = await Landfill.findOne({
            landfillManagers: req.user.userID
        });

        if (!landfill) {
            return next(createError(404, 'User is not a manager of any landfill.'));
        }

        // get the vehicles which have timeOfArrivalLandfill and timeOfDepartureLandfill is null
        const vehicles = await Vehicle.find({
            landfillID: landfill.landfillID, // vehicle should be in this landfill
            timeOfArrivalLandfill: null,
            timeOfDepartureLandfill: null,
            timeOfArrivalSts: { $ne: null }, // vehicle should have left the sts
            timeOfDepartureSts: { $ne: null }, // vehicle should have left the sts
        }).select('-_id -__v -timeOfArrivalSts -timeOfDepartureSts -timeOfArrivalLandfill -timeOfDepartureLandfill');

        res.status(200).json({
            vehicles
        });

    } catch (error) {
        next(error);
    }
}

// assign a vehicle to sts and landfill
const assignVehicle = async (req, res, next) => {
    try {
        // find vehicle
        const vehicle = await Vehicle.findOne({
            vehicleNumber: req.body.vehicleNumber
        });

        if (!vehicle) {
            return next(createError(404, 'Vehicle not found.'));
        }

        // check if vehicle is already assigned to a sts and a landfill
        if (vehicle.stsID || vehicle.landfillID) {
            return next(createError(400, 'Vehicle is already assigned to a STS and a Landfill.'));
        }

        // find sts
        const sts = await Sts.findOne({
            stsID: req.body.stsID
        });

        if (!sts) {
            return next(createError(404, 'STS not found.'));
        }

        // find landfill
        const landfill = await Landfill.findOne({
            landfillID: req.body.landfillID
        });

        if (!landfill) {
            return next(createError(404, 'Landfill not found.'));
        }

        // add vehicleNumber to sts
        sts.vehicleNumbers.push(vehicle.vehicleNumber);
        // save sts
        await sts.save();

        // add vehicleNumber to landfill
        landfill.vehicleNumbers.push(vehicle.vehicleNumber);
        // save landfill
        await landfill.save();

        // update vehicle stsID, landfillID
        vehicle.stsID = sts.stsID;
        vehicle.landfillID = landfill.landfillID;

        // save vehicle
        await vehicle.save();

        res.status(200).json({
            message: 'Vehicle assigned successfully.'
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
    getAVehicle,
    getVehiclesInSts,
    getVehiclesInLandfill,
    assignVehicle
};

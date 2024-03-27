// external imports
const createError = require('http-errors');

// internal imports
const Sts = require('../models/Sts');
const Landfill = require('../models/Landfill');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');

// add new sts
const addNewSts = async (req, res, next) => {
    try {
        // check if sts already exists
        const sts = await Sts.findOne({
            stsID: req.body.stsID
        });

        if (sts) {
            return next(createError(400, 'STS already exists.'));
        }

        // create new sts
        const newSts = new Sts({
            stsID: req.body.stsID,
            wardNumber: req.body.wardNumber,
            capacity: req.body.capacity,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
        });

        // save sts
        await newSts.save();

        res.status(201).json({
            message: 'STS added successfully.'
        });

    } catch (error) {
        next(error);
    }
}

// add sts managers
const addStsManagers = async (req, res, next) => {
    try {
        // find sts
        const sts = await Sts.findOne({
            stsID: req.body.stsID
        });

        if (!sts) {
            return next(createError(404, 'STS not found.'));
        }

        // iterate over managers array. and check if the user exists. if not, return error.
        for (let i = 0; i < req.body.stsManagers.length; i++) {
            const user = await User.findOne({
                userID: req.body.stsManagers[i]
            });

            if (!user) {
                return next(createError(404, 'User ' + req.body.stsManagers[i] + ' not found.'));
            }
        }

        // check if the roleID of the user is 2. roleID 2 is for sts manager.
        for (let i = 0; i < req.body.stsManagers.length; i++) {
            const user = await User.findOne({
                userID: req.body.stsManagers[i]
            });

            // check if any of roleIDs is 2. if not, return error.
            if (!user.roleIDs.includes(2)) {
                return next(createError(400, 'User ' + req.body.stsManagers[i] + ' is not an STS manager.'));
            }
        }

        // check if any of the managers are already assigned to any sts. sts has stsManagers array.
        for (let i = 0; i < req.body.stsManagers.length; i++) {
            const manager = await Sts.findOne({
                stsManagers: req.body.stsManagers[i]
            });

            if (manager) {
                return next(createError(400, 'User ' + req.body.stsManagers[i] + ' is already assigned to another STS.'));
            }
        }

        // check if any of the managers are already assigned to any landfill. landfill has landfillManagers array.
        for (let i = 0; i < req.body.stsManagers.length; i++) {
            const manager = await Landfill.findOne({
                landfillManagers: req.body.stsManagers[i]
            });

            if (manager) {
                return next(createError(400, 'User ' + req.body.stsManagers[i] + ' is already assigned to a landfill.'));
            }
        }

        // add managers to sts
        for (let i = 0; i < req.body.stsManagers.length; i++) {
            sts.stsManagers.push(req.body.stsManagers[i]);
        }

        // save sts
        await sts.save();

        res.status(200).json({
            message: 'STS managers added successfully.'
        });

    } catch (error) {
        next(error);
    }
}


// get all sts
const getAllSts = async (req, res, next) => {
    try {
        const sts = await Sts.find().select('-_id -__v');

        res.status(200).json({
            sts
        });

    } catch (error) {
        next(error);
    }
}

// get sts by id
const getStsById = async (req, res, next) => {
    try {
        const sts = await Sts.findOne({
            stsID: req.params.stsID
        }).select('-_id -__v');

        if (!sts) {
            return next(createError(404, 'STS not found.'));
        }

        res.status(200).json({
            sts
        });

    } catch (error) {
        next(error);
    }
}

// add vehicles to sts
const addVehiclesToSts = async (req, res, next) => {
    try {
        // find sts
        const sts = await Sts.findOne({
            stsID: req.body.stsID
        });

        if (!sts) {
            return next(createError(404, 'STS not found.'));
        }

        // iterate over vehicleNumbers array. and check if the vehicle exists. if not, return error.
        for (let i = 0; i < req.body.vehicleNumbers.length; i++) {
            const vehicle = await Vehicle.findOne({
                vehicleNumber: req.body.vehicleNumbers[i]
            });

            if (!vehicle) {
                return next(createError(404, 'vechicle number ' + req.body.vehicleNumbers[i] + ' not found.'));
            }
        }

        // check if any of the vehicles are already assigned to any sts. sts has vehicleNumbers array.
        for (let i = 0; i < req.body.vehicleNumbers.length; i++) {
            const vehicle = await Sts.findOne({
                vehicleNumbers: req.body.vehicleNumbers[i]
            });

            if (vehicle) {
                return next(createError(400, 'vehicle number ' + req.body.vehicleNumbers[i] + ' is already assigned to another STS.'));
            }
        }

        // add vehicles to sts
        for (let i = 0; i < req.body.vehicleNumbers.length; i++) {
            sts.vehicleNumbers.push(req.body.vehicleNumbers[i]);
        }

        // update vehicle stsID
        for (let i = 0; i < req.body.vehicleNumbers.length; i++) {
            const vehicle = await Vehicle.findOne({
                vehicleNumber: req.body.vehicleNumbers[i]
            });

            vehicle.stsID = req.body.stsID;
            await vehicle.save();
        }

        // save sts
        await sts.save();

        res.status(200).json({
            message: 'Vehicle added to STS successfully.'
        });
    } catch (error) {
        next(error);
    }
}

// get all the users who are not assigned to any sts but have the role of sts manager
const getUnassignedStsManagers = async (req, res, next) => {
    try {
        // first get all the users who have the role of sts manager. roleIDs array has the role ID of sts manager.
        const stsManagers = await User.find({
            roleIDs: 2
        }).select('-_id -__v -password')

        // iterate over stsManagers array. and check if the user is assigned to any sts. sts has stsManagers array.
        const unassignedStsManagers = [];
        for (let i = 0; i < stsManagers.length; i++) {
            const sts = await Sts.findOne({
                stsManagers: stsManagers[i].userID
            });

            const landfill = await Landfill.findOne({
                landfillManagers: stsManagers[i].userID
            });

            if (!sts && !landfill) {
                unassignedStsManagers.push(stsManagers[i]);
            }
        }

        res.status(200).json({
            unassignedStsManagers
        });

    } catch (error) {
        next(createError(500, 'Internal server error.'));
    }
}


// export
module.exports = {
    addNewSts,
    addStsManagers,
    getAllSts,
    getStsById,
    addVehiclesToSts,
    getUnassignedStsManagers
};

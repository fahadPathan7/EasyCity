// external imports
const createError = require('http-errors');

// internal imports
const User = require('../models/User');
const Landfill = require('../models/Landfill');

// add new landfill
const addNewLandfill = async (req, res, next) => {
    try {
        // check if landfill already exists
        const landfill = await Landfill.findOne({
            landfillID: req.body.landfillID
        });

        if (landfill) {
            return next(createError(400, 'Landfill already exists.'));
        }

        // create new landfill
        const newLandfill = new Landfill({
            landfillID: req.body.landfillID,
            name: req.body.name,
            operationalTimespan: req.body.operationalTimespan,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
        });

        // save landfill
        await newLandfill.save();

        res.status(201).json({
            message: 'Landfill added successfully.'
        });

    } catch (error) {
        next(error);
    }
}

// add landfill managers
const addLandfillManagers = async (req, res, next) => {
    try {
        // find landfill
        const landfill = await Landfill.findOne({
            landfillID: req.body.landfillID
        });

        if (!landfill) {
            return next(createError(404, 'Landfill not found.'));
        }

        // iterate over managers array. and check if the user exists. if not, return error.
        for (let i = 0; i < req.body.landfillManagers.length; i++) {
            const user = await User.findOne({
                userID: req.body.landfillManagers[i]
            });

            if (!user) {
                return next(createError(404, 'User ' + req.body.landfillManagers[i] + ' not found.'));
            }
        }

        // iterate over managers array. and check roleID. if not 3, return error.
        for (let i = 0; i < req.body.landfillManagers.length; i++) {
            const user = await User.findOne({
                userID: req.body.landfillManagers[i]
            });

            // if any of the roleID of user.roleIDs is not 3, return error.
            if (!user.roleIDs.includes(3)) {
                return next(createError(400, 'User ' + req.body.landfillManagers[i] + ' is not a landfill manager.'));
            }
        }

        // check if any of the managers are already assigned to any landfill. landfill has landfillManagers array.
        for (let i = 0; i < req.body.landfillManagers.length; i++) {
            const manager = await Landfill.findOne({
                landfillManagers: req.body.landfillManagers[i]
            });

            if (manager) {
                return next(createError(400, 'User ' + req.body.landfillManagers[i] + ' is already a manager of a landfill.'));
            }
        }

        // add managers to landfill
        for (let i = 0; i < req.body.landfillManagers.length; i++) {
            landfill.landfillManagers.push(req.body.landfillManagers[i]);
        }

        // save landfill
        await landfill.save();

        res.status(200).json({
            message: 'Landfill managers added successfully.'
        });

    } catch (error) {
        next(error);
    }
}

// get all landfills
const getAllLandfills = async (req, res, next) => {
    try {
        const landfills = await Landfill.find().select('-_id -__v');

        res.status(200).json({
            landfills
        });

    } catch (error) {
        next(error);
    }
}

// get landfill by ID
const getLandfillByID = async (req, res, next) => {
    try {
        const landfill = await Landfill.findOne({
            landfillID: req.params.landfillID
        }).select('-_id -__v');

        if (!landfill) {
            return next(createError(404, 'Landfill not found.'));
        }

        res.status(200).json({
            landfill
        });

    } catch (error) {
        next(error);
    }
}

// get unassigned landfill managers
const getUnassignedLandfillManagers = async (req, res, next) => {
    try {
        const users = await User.find({
            roleIDs: 3,
            landfillID: null
        }).select('-_id -__v -password');

        // iterate over users and check if any of the user is already a manager of a landfill.
        let unassignedLandfillManagers = [];
        for (let i = 0; i < users.length; i++) {
            const manager = await Landfill.findOne({
                landfillManagers: users[i].userID
            });

            if (!manager) {
                unassignedLandfillManagers.push(users[i]);
            }
        }

        res.status(200).json({
            unassignedLandfillManagers
        });

    } catch (error) {
        next(error);
    }
}

// export
module.exports = {
    addNewLandfill,
    addLandfillManagers,
    getAllLandfills,
    getLandfillByID,
    getUnassignedLandfillManagers
};
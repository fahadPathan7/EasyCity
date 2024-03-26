// external imports
const createError = require('http-errors');

// internal imports
const Sts = require('../models/Sts');
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

// add landfill manager
const addLandfillManager = async (req, res, next) => {
    try {
        // find landfill
        const landfill = await Landfill.findOne({
            landfillID: req.body.landfillID
        });

        if (!landfill) {
            return next(createError(404, 'Landfill not found.'));
        }

        // check if landfill manager is already assigned
        if (landfill.landfillManager) {
            return next(createError(400, 'Landfill manager already assigned.'));
        }

        // check if user has landfill manager role
        const user = await User.findOne({
            userID: req.body.landfillManager,
        });

        if (!user || !user.roleIDs.includes(3)) {
            return next(createError(400, 'User does not have landfill manager role.'));
        }

        // check if landfill manager already assigned to another landfill
        const landfillManager = await Landfill.findOne({
            landfillManager: req.body.landfillManager
        });

        if (landfillManager) {
            return next(createError(400, 'Landfill manager already assigned to another landfill.'));
        }

        // check if landfill manager already assigned to a sts
        const stsManager = await Sts.findOne({
            stsManager: req.body.landfillManager
        });

        if (stsManager) {
            return next(createError(400, 'Landfill manager already assigned to a STS.'));
        }

        // assign landfill manager
        landfill.landfillManager = req.body.landfillManager;

        // save landfill
        await landfill.save();

        res.status(200).json({
            message: 'Landfill manager assigned successfully.'
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
        });

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

// export
module.exports = {
    addNewLandfill,
    addLandfillManager,
    getAllLandfills,
    getLandfillByID
};
// external imports
const createError = require('http-errors');

// internal imports
const Sts = require('../models/Sts');
const landfill = require('../models/Landfill');
const User = require('../models/User');

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

// add sts manager
const addStsManager = async (req, res, next) => {
    try {
        // find sts
        const sts = await Sts.findOne({
            stsID: req.body.stsID
        });

        if (!sts) {
            return next(createError(404, 'STS not found.'));
        }

        // check if sts manager is already assigned
        if (sts.stsManager) {
            return next(createError(400, 'STS manager already assigned.'));
        }

        // check if user has sts manager role
        const user = await User.findOne({
            userID: req.body.stsManager
        });

        if (!user || !user.roleIDs.includes(2)) {
            return next(createError(400, 'Invalid STS manager.'));
        }

        // check if sts manager already assigned to another sts
        const stsManager = await Sts.findOne({
            stsManager: req.body.stsManager
        });

        if (stsManager) {
            return next(createError(400, 'STS manager already assigned to another STS.'));
        }

        // check if sts manager already assigned to a landfill
        const landfillManager = await landfill.findOne({
            landfillManager: req.body.stsManager
        });

        if (landfillManager) {
            return next(createError(400, 'STS manager already assigned to a landfill.'));
        }

        // assign sts manager
        sts.stsManager = req.body.stsManager;

        // save sts
        await sts.save();

        res.status(200).json({
            message: 'STS manager added successfully.'
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


// export
module.exports = {
    addNewSts,
    addStsManager,
    getAllSts
};

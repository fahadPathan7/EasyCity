// external imports
const express = require('express');

// internal imports
const { addNewSts, addStsManagers, getAllSts, getStsById, addVehiclesToSts, getUnassignedStsManagers } = require('../controllers/stsController');

// router initialization
const router = express.Router();

// routes
// add new sts
router.post('/add-sts', addNewSts);

// add sts manager
router.post('/add-sts-managers', addStsManagers);

// get all sts
router.get('/all-sts', getAllSts);

// get unassigned sts managers
router.get('/unassigned-managers', getUnassignedStsManagers);

// get sts by id
router.get('/:stsID', getStsById);

// add vehicles to sts
router.post('/add-vehicles', addVehiclesToSts);


// export
module.exports = router;
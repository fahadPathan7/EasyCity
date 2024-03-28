// external imports
const express = require('express');

// internal imports
const { addNewSts, addStsManagers, getAllSts, getStsById, addVehiclesToSts, getUnassignedStsManagers, checkStsManager } = require('../controllers/stsController');
const { checkLogin } = require('../middlewares/common/checkLogin');

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

// check sts manager
router.get('/check-manager', checkLogin, checkStsManager);

// get sts by id
router.get('/:stsID', getStsById);

// add vehicles to sts
router.post('/add-vehicles-sts', addVehiclesToSts);


// export
module.exports = router;
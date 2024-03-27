// external imports
const express = require('express');

// internal imports
const { addNewVehicle, updateVehicleSts, updateVehicleLandfill, getAllUnassignedVehicles, getAllVehicles, getAVehicle } = require('../controllers/vehicleController');
const { checkLogin } = require('../middlewares/common/checkLogin');

// router initialization
const router = express.Router();

// routes
// add new vehicle
router.post('/add-vehicle', checkLogin, addNewVehicle);

// update vehicle stsID, timeOfArrivalSts, timeOfDepartureSts, volumeOfWaste
router.put('/update-vehicle-sts/:vehicleNumber', checkLogin, updateVehicleSts);

// update vehicle landfillID, timeOfArrivalLandfill, timeOfDepartureLandfill
router.put('/update-vehicle-landfill/:vehicleNumber', checkLogin, updateVehicleLandfill);

// get all vehicles which are not assigned to any sts
router.get('/unassigned-vehicles', checkLogin, getAllUnassignedVehicles);

// get all vehicles
router.get('/all-vehicles', checkLogin, getAllVehicles);

// get specific vehicle
router.get('/:vehicleNumber', checkLogin, getAVehicle);


// export
module.exports = router;
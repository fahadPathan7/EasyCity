// external imports
const express = require('express');

// internal imports
const { addNewVehicle, updateVehicleSts, updateVehicleLandfill, getAllUnassignedVehicles, getAllVehicles, getAVehicle, getVehiclesInSts, getVehiclesInLandfill, assignVehicle } = require('../controllers/vehicleController');
const { checkLogin, requirePermission } = require('../middlewares/common/checkLogin');

// router initialization
const router = express.Router();

// routes
// add new vehicle
router.post('/add-vehicle', checkLogin, requirePermission("AddVehicle"), addNewVehicle);

// assign vehicle to sts and landfill
router.post('/assign-vehicle', checkLogin, requirePermission("AssignVehicle"), assignVehicle);

// update vehicle stsID, timeOfArrivalSts, timeOfDepartureSts, volumeOfWaste
router.put('/update-vehicle-sts/:vehicleNumber', checkLogin, requirePermission("UpdateVehicleSTS"), updateVehicleSts);

// update vehicle landfillID, timeOfArrivalLandfill, timeOfDepartureLandfill
router.put('/update-vehicle-landfill/:vehicleNumber', checkLogin, requirePermission("UpdateVehicleLandfill"), updateVehicleLandfill);

// get all vehicles which are not assigned to any sts
router.get('/unassigned-vehicles', checkLogin, getAllUnassignedVehicles);

// get all vehicles
router.get('/all-vehicles', checkLogin, getAllVehicles);

// get all available vehicles in the sts of logged in user
router.get('/available-sts-vehicles', checkLogin, getVehiclesInSts);

// get all available vehicles in the landfill of logged in user
router.get('/available-landfill-vehicles', checkLogin, getVehiclesInLandfill);

// get specific vehicle
router.get('/:vehicleNumber', checkLogin, getAVehicle);


// export
module.exports = router;
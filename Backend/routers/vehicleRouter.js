// external imports
const express = require('express');

// internal imports
const { addNewVehicle, updateVehicleSts, updateVehicleLandfill } = require('../controllers/vehicleController');

// router initialization
const router = express.Router();

// routes
// add new vehicle
router.post('/add-vehicle', addNewVehicle);

// update vehicle stsID, timeOfArrivalSts, timeOfDepartureSts, volumeOfWaste
router.put('/update-vehicle-sts/:vehicleNumber', updateVehicleSts);

// update vehicle landfillID, timeOfArrivalLandfill, timeOfDepartureLandfill
router.put('/update-vehicle-landfill/:vehicleNumber', updateVehicleLandfill);

// export
module.exports = router;
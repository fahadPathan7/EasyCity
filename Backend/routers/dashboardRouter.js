// external imports
const express = require('express');

// internal imports
const {
    getVehiclesToLandfill,
    getVehiclesToSts,
    getVolumeOfWasteAtLandfills,
    getDailyCost,
    getDailyTripCount,
    getTotalDistanceTravelled,
    getTotalVolumeOfWasteTransferred,
    getVolumeOfWasteTransferredBySts
} = require('../controllers/dashboardController');

const { checkLogin } = require('../middlewares/common/checkLogin');

// router instance
const router = express.Router();

// routes
// get vehicles to landfill
router.get('/vehicles-to-landfill', checkLogin, getVehiclesToLandfill);

// get vehicles to sts
router.get('/vehicles-to-sts', checkLogin, getVehiclesToSts);

// get volume of waste at landfills
router.get('/volume-of-waste-at-landfills', checkLogin, getVolumeOfWasteAtLandfills);

// get daily cost of seven days
router.get('/daily-cost-seven-days', checkLogin, getDailyCost);

// get daily trip count of seven days
router.get('/daily-trip-count-seven-days', checkLogin, getDailyTripCount);

// get total distance travelled seven days
router.get('/total-distance-travelled-seven-days', checkLogin, getTotalDistanceTravelled);

// get total volume of waste transferred seven days
router.get('/total-volume-of-waste-transferred-seven-days', checkLogin, getTotalVolumeOfWasteTransferred);

// get volume of waste transferred by sts today
router.get('/volume-of-waste-transferred-by-sts-today', checkLogin, getVolumeOfWasteTransferredBySts);

module.exports = router;
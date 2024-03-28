// external imports
const express = require('express');

// internal imports
const { createFleet } = require('../controllers/fleetController');
const { checkLogin } = require('../middlewares/common/checkLogin');

// router initialization
const router = express.Router();

// routes
// create fleet
router.post('/create-fleet/:wasteNeedToTransfer',checkLogin, createFleet);

// export
module.exports = router;
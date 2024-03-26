// external imports
const express = require('express');

// internal imports
const { addNewSts, addStsManager, getAllSts } = require('../controllers/stsController');

// router initialization
const router = express.Router();

// routes
router.post('/add-sts', addNewSts);
router.post('/add-sts-manager', addStsManager);
router.get('/all-sts', getAllSts);

// export
module.exports = router;
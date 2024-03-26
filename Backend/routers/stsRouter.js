// external imports
const express = require('express');

// internal imports
const { addNewSts, addStsManager, getAllSts, getStsById } = require('../controllers/stsController');

// router initialization
const router = express.Router();

// routes
// add new sts
router.post('/add-sts', addNewSts);

// add sts manager
router.post('/add-sts-manager', addStsManager);

// get all sts
router.get('/all-sts', getAllSts);

// get sts by id
router.get('/:stsID', getStsById);

// export
module.exports = router;
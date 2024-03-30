// external imports
const express = require('express');

// internal imports
const { addNewSts, addStsManagers, getAllSts, getStsById, getUnassignedStsManagers, checkStsManager } = require('../controllers/stsController');
const { checkLogin, requirePermission } = require('../middlewares/common/checkLogin');

// router initialization
const router = express.Router();

// routes
// add new sts
router.post('/add-sts', requirePermission("AddNewSTS"), addNewSts);

// add sts manager
router.post('/add-sts-managers', requirePermission("AddSTSManagers"), addStsManagers);

// get all sts
router.get('/all-sts', getAllSts);

// get unassigned sts managers
router.get('/unassigned-managers', getUnassignedStsManagers);

// check sts manager
router.get('/check-manager', checkLogin, checkStsManager);

// get sts by id
router.get('/:stsID', getStsById);


// export
module.exports = router;
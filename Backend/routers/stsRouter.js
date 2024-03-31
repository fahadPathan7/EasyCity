// external imports
const express = require('express');

// internal imports
const { addNewSts, addStsManagers, getAllSts, getStsById, getUnassignedStsManagers, checkStsManager } = require('../controllers/stsController');
const { checkLogin, requirePermission } = require('../middlewares/common/checkLogin');

// router initialization
const router = express.Router();

// routes
// add new sts
router.post('/add-sts', checkLogin, requirePermission("AddNewSTS"), addNewSts);

// add sts manager
router.post('/add-sts-managers', checkLogin, requirePermission("AddSTSManagers"), addStsManagers);

// get all sts
router.get('/all-sts', checkLogin, getAllSts);

// get unassigned sts managers
router.get('/unassigned-managers', checkLogin, getUnassignedStsManagers);

// check sts manager
router.get('/check-manager', checkLogin, checkStsManager);

// get sts by id
router.get('/:stsID', checkLogin, getStsById);


// export
module.exports = router;
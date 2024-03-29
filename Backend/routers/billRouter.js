// external imports
const express = require('express');

// internal imports
const { checkLogin } = require('../middlewares/common/checkLogin');
const { getABill, getAllBills } = require('../controllers/billController');

// router initialization
const router = express.Router();

// routes
// get all bills
router.get('/getBills', checkLogin, getAllBills);

// get a bill with billID
router.get('/:billID', checkLogin, getABill);


// export
module.exports = router;
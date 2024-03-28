// external imports
const express = require('express');

// internal imports
const { checkLogin } = require('../middlewares/common/checkLogin');
const { getABill, getAllBills } = require('../controllers/billController');

// router initialization
const router = express.Router();

// routes
// get a bill with billID
router.get('/:billID', checkLogin, getABill);

// get all bills
router.get('/', checkLogin, getAllBills);

// export
module.exports = router;
// external imports
const express = require('express');

// internal imports
const { getProfile, updateProfile } = require('../controllers/profileController');

// router initialization
const router = express.Router();

// routes
// get profile
router.get('/:userID', getProfile);

// update profile
router.put('/:userID', updateProfile);

// export
module.exports = router;
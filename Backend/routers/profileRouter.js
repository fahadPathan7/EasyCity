// external imports
const express = require('express');
const multer = require('multer');

// for file upload
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function(req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname)
    }
  })

  const upload = multer({ storage: storage });

// internal imports
const { getProfile, updateProfileImages, updateProfileData } = require('../controllers/profileController');
const { checkLogin } = require("../middlewares/common/checkLogin");

// router initialization
const router = express.Router();

// routes
// get profile
router.get('/', checkLogin, getProfile);

// update profile images
router.put('/images', checkLogin, upload.fields([{ name: 'coverImage', maxCount: 1 }, { name: 'profileImage', maxCount: 1 }]), updateProfileImages);

// update profile data
router.put('/', checkLogin, updateProfileData);

// export
module.exports = router;
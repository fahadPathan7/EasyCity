// external imports
const createError = require('http-errors');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// internal imports
const User = require('../models/User');


// get user profile
const getProfile = async (req, res, next) => {
    try {
        const user = await User.findOne({
            userID: req.params.userID
        }).select('-_id -__v -password');
        if (!user) {
            next(createError(404, 'User not found.'));
        }
        res.status(200).json({
            user
        });
        // it will return user profile
    } catch (error) {
        next(error);
    }
}

// update user profile
const updateProfile = async (req, res, next) => {
    console.log(req.body, req.files); //!
    try {
        const user = await User.findOne({
            userID: req.params.userID
        });
        if (!user) {
            next(createError(404, 'User not found.'));
        }
        const updates = Object.keys(req.body);
        updates.forEach(update => user[update] = req.body[update]);

        // Handle the coverImage and profileImage
        if (req.files.coverImage) {
            user.coverImage = req.files.coverImage[0].path;
        }
        if (req.files.profileImage) {
            user.profileImage = req.files.profileImage[0].path;
        }

        await user.save();
        res.status(200).json({
            "message": "Profile updated successfully."
        });
        // it will update user profile
    }
    catch (error) {
        next(error);
    }
}

// export
module.exports = {
    getProfile,
    updateProfile: upload.fields([{ name: 'coverImage', maxCount: 1 }, { name: 'profileImage', maxCount: 1 }]), updateProfile
};
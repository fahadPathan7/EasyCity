// external imports
const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

// internal imports
const User = require("../models/User");

// get user profile
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findOne({
      userID: req.user.userID,
    }).select("-_id -__v -password");
    if (!user) {
      next(createError(404, "User not found."));
    }
    res.status(200).json({
      user,
    });
    // it will return user profile
  } catch (error) {
    next(error);
  }
};

// update user profile
const updateProfileImages = async (req, res, next) => {
  try {
    const user = await User.findOne({
      userID: req.user.userID,
    });
    if (!user) {
      next(createError(404, "User not found."));
    }
    // const updates = Object.keys(req.body);
    // updates.forEach(update => (user[update] = req.body[update]));

    // Handle the coverImage and profileImage
    if (req.files.coverImage) {
      // If there's a previous coverImage, delete it
      if (user.coverImage) {
        fs.unlink(path.join(__dirname, "..", user.coverImage), err => {
          if (err) console.error("Error deleting previous coverImage:", err);
        });
      }

      user.coverImage = req.files.coverImage[0].path;
    }
    if (req.files.profileImage) {
      // If there's a previous profileImage, delete it
      if (user.profileImage) {
        fs.unlink(path.join(__dirname, "..", user.profileImage), err => {
          if (err) console.error("Error deleting previous profileImage:", err);
        });
      }

      user.profileImage = req.files.profileImage[0].path;
    }

    await user.save();

    res.status(200).json({
      message: "Profile images updated successfully.",
    });
  } catch (error) {
    next(error);
  }
};

// update profile data
const updateProfileData = async (req, res, next) => {
  try {
    const user = await User.findOne({
      userID: req.user.userID,
    });

    if (!user) {
      next(createError(404, "User not found."));
    }

    // name, email, mobile can be updated if provided
    if (req.body.name) {
      user.name = req.body.name;
    }
    if (req.body.email) {
      user.email = req.body.email;
    }
    if (req.body.mobile) {
      user.mobile = req.body.mobile;
    }

    await user.save();

    // Get the new user data
    const newUserObject = {
      userID: user.userID,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      roleIDs: user.roleIDs,
    };

    const token = jwt.sign(newUserObject, process.env.JWT_SECRET, {
      expiresIn: "72h",
    });

    // Set a new cookie
    res.cookie(process.env.COOKIE_NAME, token, {
      maxAge: 72 * 60 * 60 * 1000,
      httpOnly: true,
      secure: false,
      signed: true,
      sameSite: 'none',
    });

    // Set the updated user as the logged in user
    res.locals.loggedInUser = newUserObject;

    res.status(200).json({
      message: "Profile updated successfully.",
    });
  } catch (error) {
    next(error);
  }
};

// export
module.exports = {
  getProfile,
  updateProfileImages,
  updateProfileData,
};

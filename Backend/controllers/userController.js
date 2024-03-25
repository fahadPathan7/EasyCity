// external imports
const createError = require('http-errors');

// internal imports
const User = require('../models/User');
const Role = require('../models/Role');

// get all users
const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('-_id -__v -password');
        res.status(200).json({
            users
        });
        // it will return all users
    } catch (error) {
        next(error);
    }
}

// get user by userID
const getUserByUserID = async (req, res, next) => {
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
        // it will return user by userID
    }
    catch (error) {
        next(error);
    }
}

// update user by userID
const updateUserByUserID = async (req, res, next) => {
    try {
        const user = await User.findOne({
            userID: req.params.userID
        });
        if (!user) {
            next(createError(404, 'User not found.'));
        }
        // update only name, email, and phone. if provided
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

        res.status(200).json({
            "message": "User updated successfully."
        });
        // it will update user by userID
    }
    catch (error) {
        next(error);
    }
}

// delete user by userID
const deleteUserByUserID = async (req, res, next) => {
    try {
        const user = await User.findOne({
            userID: req.params.userID
        });
        if (!user) {
            next(createError(404, 'User not found.'));
        }
        await user.deleteOne({ userID: req.params.userID });
        res.status(200).json({
            "message": "User deleted successfully."
        });
        // it will delete user by userID
    }
    catch (error) {
        next(error);
    }
}

// get all available roles
const getAllRolesOfUsers = async (req, res, next) => {
    try {
        const roles = await Role.find().select('-_id -__v');
        res.status(200).json({
            roles
        });
    } catch (error) {
        next(error);
    }
}

// update user role by userID
const updateUserRoleByUserID = async (req, res, next) => {
    try {
        const user = await User.findOne({
            userID: req.params.userID
        });
        if (!user) {
            next(createError(404, 'User not found.'));
        }
        user.roleIDs = req.body.roleIDs;
        if (!user.roleIDs) {
            user.roleIDs = [4];
        }
        await user.save();
        res.status(200).json({
            "message": "User role updated successfully."
        });
        // it will update user role by userID
    }
    catch (error) {
        next(error);
    }
}

// export
module.exports = {
    getAllUsers,
    getUserByUserID,
    updateUserByUserID,
    deleteUserByUserID,
    getAllRolesOfUsers,
    updateUserRoleByUserID
};
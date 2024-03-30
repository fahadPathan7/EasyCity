// external imports
const express = require('express');

// internal imports
const { getAllUsers, getUserByUserID, updateUserByUserID, deleteUserByUserID, getAllRolesOfUsers, updateUserRoleByUserID } = require('../controllers/userController');
const { checkLogin, requirePermission } = require('../middlewares/common/checkLogin');


// router initialization
const router = express.Router();

// routes
// get all users
router.get('/', checkLogin, getAllUsers);

// get all roles
router.get('/roles', checkLogin, getAllRolesOfUsers);

// get user by userID
router.get('/:userID', checkLogin, getUserByUserID);

// update user by userID
router.put('/:userID', checkLogin, requirePermission("UpdateSpecificUser"), updateUserByUserID);

// delete user by userID
router.delete('/:userID', checkLogin, requirePermission("DeleteSpecificUser"), deleteUserByUserID);

// update user role by userID
router.put('/:userID/roles', checkLogin, requirePermission("UpdateSpecificUserRoles"), updateUserRoleByUserID);


// export
module.exports = router;
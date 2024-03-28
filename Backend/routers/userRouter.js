// external imports
const express = require('express');

// internal imports
const { getAllUsers, getUserByUserID, updateUserByUserID, deleteUserByUserID, getAllRolesOfUsers, updateUserRoleByUserID } = require('../controllers/userController');
const { checkLogin } = require('../middlewares/common/checkLogin');


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
router.put('/:userID', checkLogin, updateUserByUserID);

// delete user by userID
router.delete('/:userID', checkLogin, deleteUserByUserID);

// update user role by userID
router.put('/:userID/roles', checkLogin, updateUserRoleByUserID);


// export
module.exports = router;
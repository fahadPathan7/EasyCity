// external imports
const express = require('express');

// internal imports
const { login, register, logout } = require('../controllers/authController');
const { registerValidator, registerValidationHandler, loginValidator, loginValidationHandler } = require('../middlewares/users/authValidator');
const { checkLogin, requirePermission } = require('../middlewares/common/checkLogin');

// initiate router instance
const router = express.Router();

// create user
router.post('/create', checkLogin, requirePermission('CreateUser'), registerValidator, registerValidationHandler, register);

// user login
router.post('/login', loginValidator, loginValidationHandler, login);

// user logout
router.delete('/logout', logout);

// export
module.exports = router;

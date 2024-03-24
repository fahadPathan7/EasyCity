// external imports
const express = require('express');

// internal imports
const { login, register, logout } = require('../controllers/authController');
const { registerValidator, registerValidationHandler, loginValidator, loginValidationHandler } = require('../middlewares/users/authValidator');

// initiate router instance
const router = express.Router();

// create user
router.post('/create', registerValidator, registerValidationHandler, register);

// user login
router.post('/login', loginValidator, loginValidationHandler, login);

// user logout
router.delete('/logout', logout);

// export
module.exports = router;

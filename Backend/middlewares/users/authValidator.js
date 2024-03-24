// external imports
const { check, validationResult } = require('express-validator');
const createError = require('http-errors');

// internal imports
const User = require('../../models/User');

// register validators
const registerValidator = [
    check('name').not().isEmpty().withMessage('Name is required.'),
    check('email').isEmail().withMessage('Invalid email address.').custom(async (value) => {
        const user = await User.findOne({ email: value });
        if (user) {
            throw createError(400, 'Email already in use.');
        }
        return true;
    }),
    check('mobile').isMobilePhone().withMessage('Invalid mobile number.').custom(async (value) => {
        const user = await User.findOne({ mobile: value });
        if (user) {
            throw createError(400, 'Mobile number already in use.');
        }
        return true;
    }),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
    check('roleID').isInt().withMessage('Invalid role ID.').custom((value) => {
        if (![1, 2, 3, 4].includes(value)) {
            throw createError(400, 'Invalid role ID.');
        }
        return true;
    })
];

// register validation handler
const registerValidationHandler = (req, res, next) => {
    const errors = validationResult(req);
    const mappedErrors = errors.mapped();

    if (Object.keys(mappedErrors).length === 0) {
        next();
    } else {
        res.status(500).json({ errors: mappedErrors });
    }
}

// login validators
const loginValidator = [
    check('username').not().isEmpty().withMessage('Username is required.'),
    check('password').not().isEmpty().withMessage('Password is required.')
];

// login validation handler
const loginValidationHandler = (req, res, next) => {
    const errors = validationResult(req);
    const mappedErrors = errors.mapped();

    if (Object.keys(mappedErrors).length === 0) {
        next();
    } else {
        res.status(500).json({ errors: mappedErrors });
    }
}

// export
module.exports = {
    registerValidator,
    registerValidationHandler,
    loginValidator,
    loginValidationHandler
};
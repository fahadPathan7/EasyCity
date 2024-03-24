// external imports
const { check, validationResult } = require('express-validator');
const createError = require('http-errors');

// register validators
const registerValidator = [
    check('name').not().isEmpty().withMessage('Name is required.'),
    check('email').isEmail().withMessage('Invalid email address.'),
    check('mobile').isMobilePhone().withMessage('Invalid mobile number.'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
    check('roleID').isInt().withMessage('Invalid role ID.')
];

const registerValidationHandler = (req, res, next) => {
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
    registerValidationHandler
};
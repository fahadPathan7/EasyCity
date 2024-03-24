// external imports
const createError = require('http-errors');
const jwt = require('jsonwebtoken');

// check login
const checkLogin = (req, res, next) => {
    let cookies = Object.keys(req.signedCookies).length === 0 ? null : req.signedCookies;

    if (cookies) {
        try {
            const token = cookies[process.env.COOKIE_NAME];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            throw createError(401, 'Authentication failed.');
        }
    }
    else {
        throw createError(401, 'Authentication failed.');
    }
}

// guard to protect routes
function requirePermission(permission) {
    return (req, res, next) => {
        // search in the database if the user role has the permission
        if (req.user.role.permissions.includes(permission)) {
            next();
        } else {
            throw createError(403, 'Permission denied.');
        }
    }
}

// export middlewares
module.exports = {
    checkLogin,
    requirePermission
};


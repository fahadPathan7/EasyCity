// external imports
const createError = require('http-errors');
const jwt = require('jsonwebtoken');

// internal imports
const Role = require('../../models/Role');

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
            next(createError(401, 'Authentication failed.'));
        }
    }
    else {
        next(createError(401, 'Cookie not found.'));
    }
}

// guard to protect routes
function requirePermission(permission) {
    // user has roleID, then Role has permissions. If user has permission, then user can access the route.
    return async (req, res, next) => {
        try {
            const role = await Role.findOne({ roleID: req.user.roleID });
            if (role.permissions.includes(permission)) {
                next();
            } else {
                next(createError(403, 'Permission denied.'));
            }
        } catch (error) {
            next(createError(500, 'Internal server error.'));
        }
    }
}

// export middlewares
module.exports = {
    checkLogin,
    requirePermission
};


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
            // get user roleIDs
            const roleIDs = req.user.roleIDs;
            // get all roles
            const roles = await Role.find({ roleID: { $in: roleIDs } });
            // get all permissions
            let permissions = [];
            roles.forEach(role => {
                permissions = permissions.concat(role.permissions);
            });
            // check if user has permission
            const isPermitted = permissions.includes(permission);
            if (isPermitted) {
                next();
            } else {
                next(createError(403, 'User does not have permission.'));
            }
        }
        catch (error) {
            next(createError(500, 'Something went wrong.'))
        }
    }
}

// export middlewares
module.exports = {
    checkLogin,
    requirePermission
};


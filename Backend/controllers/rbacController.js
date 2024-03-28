// external imports
const createError = require('http-errors');

// internal imports
const Role = require('../models/Role');
const Permission = require('../models/Permission');
const User = require('../models/User');

// get all roles
const getAllRoles = async (req, res, next) => {
    try {
        const roles = await Role.find().select('-_id -__v');
        res.status(200).json({
            roles
        });
        // it will return all roles
    } catch (error) {
        next(error);
    }
}

// get all permissions
const getAllPermissions = async (req, res, next) => {
    try {
        const permissions = await Permission.find().select('-_id -__v');
        res.status(200).json({
            permissions
        });
        // it will return all permissions
    } catch (error) {
        next(error);
    }
}

// create role
const createRole = async (req, res, next) => {
    try {
        // check if role already exists
        const role = await Role.findOne({
                roleID: req.body.roleID
            });
        if (role) {
            next(createError(400, 'Role already exists.'));
        }

        const newRole = new Role(req.body);
        await newRole.save();
        res.status(201).json({
            "message": "Role created successfully."
        });
        // it will create a new role
    } catch (error) {
        next(error);
    }
}

// create permission
const createPermission = async (req, res, next) => {
    try {
        // check if permission already exists
        const permission = await Permission.findOne({
                permissionName: req.body.permissionName
            });
        if (permission) {
            next(createError(400, 'Permission already exists.'));
        }

        const newPermission = new Permission(req.body);
        await newPermission.save();
        res.status(201).json({
            "message": "Permission created successfully."
        });
        // it will create a new permission
    } catch (error) {
        next(error);
    }
}

// assign permissions to role
const assignPermissionsToRole = async (req, res, next) => {
    try {
        const role = await Role.findOne({
                roleID: parseInt(req.params.roleID)
            });
        if (!role) {
            next(createError(404, 'Role not found.'));
        }

        role.permissions = Array.from(new Set([...role.permissions, ...req.body.permissions]));
        await role.save();

        res.status(200).json({
            "message": "Permissions assigned to role successfully."
        });
    } catch (error) {
        next(error);
    }
}

// assign roles to user
const assignRolesToUser = async (req, res, next) => {
    try {
        const user = await User.findOne({
                userID: req.params.userID
            });
        if (!user) {
            next(createError(404, 'User not found.'));
        }

        // update roleIDs no duplicate. multiple roles can be assigned to a user
        user.roleIDs = Array.from(new Set([...user.roleIDs, ...req.body.roleIDs]));
        await user.save();

        res.status(200).json({
            "message": "Role assigned to user successfully."
        });
    }
    catch (error) {
        next(error);
    }
}

// get permissions of a role
// api: /rbac/roles/{roleID}/permissions
const getPermissionsOfRole = async (req, res, next) => {
    try {
        const role = await Role.findOne({
                roleID: parseInt(req.params.roleID)
            });
        if (!role) {
            next(createError(404, 'Role not found.'));
        }

        const permissions = await Permission.find({
                permissionName: {
                    $in: role.permissions
                }
            }).select('-_id -__v');
        res.status(200).json({
            permissions
        });
    } catch (error) {
        next(error);
    }
}

// delete a permission from a role
const deletePermissionFromRole = async (req, res, next) => {
    try {
        const role = await Role.findOne({
                roleID: parseInt(req.params.roleID)
            });
        if (!role) {
            next(createError(404, 'Role not found.'));
        }

        role.permissions = role.permissions.filter(permission => permission !== req.params.permissionName);
        await role.save();

        res.status(200).json({
            "message": "Permission deleted from role successfully."
        });
    } catch (error) {
        next(error);
    }
}

// export
module.exports = {
    getAllRoles,
    getAllPermissions,
    createRole,
    createPermission,
    assignPermissionsToRole,
    assignRolesToUser,
    getPermissionsOfRole,
    deletePermissionFromRole
};
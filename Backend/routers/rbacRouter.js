// external imports
const express = require('express');

// internal imports
const { getAllRoles, getAllPermissions, createRole, createPermission, assignPermissionToRole, assignRoleToUser } = require('../controllers/rbacController');

// router initialization
const router = express.Router();

// routes
// get all roles
router.get('/roles', getAllRoles);

// get all permissions
router.get('/permissions', getAllPermissions);

// create role
router.post('/role', createRole);

// create permission
router.post('/permission', createPermission);

// assign permissions to role
// api: /rbac/roles/{roleID}/permissions
router.post('/roles/:roleID/permissions', assignPermissionToRole);

// assign role to user
// api: /rbac/users/{userID}/roles
router.post('/users/:userID/roles', assignRoleToUser);

// export
module.exports = router;
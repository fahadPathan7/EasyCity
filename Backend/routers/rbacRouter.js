// external imports
const express = require('express');

// internal imports
const { getAllRoles, getAllPermissions, createRole, createPermission, assignPermissionsToRole, assignRolesToUser } = require('../controllers/rbacController');
const { checkLogin, requirePermission } = require('../middlewares/common/checkLogin');

// router initialization
const router = express.Router();

// routes
// get all roles
router.get('/roles', checkLogin, requirePermission('GetRoles'), getAllRoles);

// get all permissions
router.get('/permissions', checkLogin, requirePermission('GetPermissions'), getAllPermissions);

// create role
router.post('/role', checkLogin, requirePermission('CreateRole'), createRole);

// create permission
router.post('/permission', checkLogin, requirePermission('CreatePermission'), createPermission);

// assign permissions to role
// api: /rbac/roles/{roleID}/permissions
router.post('/roles/:roleID/permissions', checkLogin, requirePermission('AssignPermissionsToRole'), assignPermissionsToRole);

// assign role to user
// api: /rbac/users/{userID}/roles
router.post('/users/:userID/roles', checkLogin, requirePermission('AssignRoleToUser'), assignRolesToUser);

// export
module.exports = router;
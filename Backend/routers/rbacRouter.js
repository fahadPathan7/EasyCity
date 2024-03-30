// external imports
const express = require('express');

// internal imports
const { getAllRoles, getAllPermissions, createRole, createPermission, assignPermissionsToRole, assignRolesToUser, getPermissionsOfRole, deletePermissionFromRole } = require('../controllers/rbacController');
const { checkLogin, requirePermission } = require('../middlewares/common/checkLogin');

// router initialization
const router = express.Router();

// routes
// get all roles
router.get('/roles', checkLogin, getAllRoles);

// get all permissions
router.get('/permissions', checkLogin, getAllPermissions);

// get permissions of a role
// api: /rbac/roles/{roleID}/permissions
router.get('/roles/:roleID/permissions', checkLogin, getPermissionsOfRole);

// create role
router.post('/role', checkLogin, requirePermission('CreateRole'), createRole);

// create permission
router.post('/permission', checkLogin, requirePermission('CreatePermission'), createPermission);

// assign permissions to role
// api: /rbac/roles/{roleID}/permissions
router.post('/roles/:roleID/permissions', checkLogin, requirePermission('AssignPermissionsToRole'), assignPermissionsToRole);

// assign roles to user
// api: /rbac/users/{userID}/roles
router.post('/users/:userID/roles', checkLogin, requirePermission('AssignRolesToUser'), assignRolesToUser);

// delete a permission from a role
router.delete('/roles/:roleID/permissions/:permissionName', checkLogin, requirePermission("DeleteAPermissionFromARole"), deletePermissionFromRole);

// export
module.exports = router;
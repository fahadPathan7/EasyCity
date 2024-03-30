// external imports
const express = require("express");

// internal imports
const { addNewLandfill, addLandfillManagers, getAllLandfills, getLandfillByID, getUnassignedLandfillManagers, checkLandfillManager } = require("../controllers/landfillController");
const { checkLogin, requirePermission } = require("../middlewares/common/checkLogin");

// router initialization
const router = express.Router();

// routes
// add new landfill
router.post("/add-landfill", checkLogin, requirePermission("AddNewLandfill"), addNewLandfill);

// add landfill manager
router.post("/add-landfill-managers", checkLogin, requirePermission("AddLandfillManagers"), addLandfillManagers);

// get all landfills
router.get("/all-landfills", checkLogin, getAllLandfills);

// get unassigned landfill managers
router.get("/unassigned-managers", checkLogin, getUnassignedLandfillManagers);

// check landfill manager
router.get("/check-manager", checkLogin, checkLandfillManager);

// get landfill by id
router.get("/:landfillID", checkLogin, getLandfillByID);


// export
module.exports = router;
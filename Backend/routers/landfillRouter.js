// external imports
const express = require("express");

// internal imports
const { addNewLandfill, addLandfillManagers, getAllLandfills, getLandfillByID, getUnassignedLandfillManagers, checkLandfillManager } = require("../controllers/landfillController");
const { checkLogin } = require("../middlewares/common/checkLogin");

// router initialization
const router = express.Router();

// routes
// add new landfill
router.post("/add-landfill", addNewLandfill);

// add landfill manager
router.post("/add-landfill-managers", addLandfillManagers);

// get all landfills
router.get("/all-landfills", getAllLandfills);

// get unassigned landfill managers
router.get("/unassigned-managers", getUnassignedLandfillManagers);

// check landfill manager
router.get("/check-manager", checkLogin, checkLandfillManager);

// get landfill by id
router.get("/:landfillID", getLandfillByID);


// export
module.exports = router;
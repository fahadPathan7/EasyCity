// external imports
const express = require("express");

// internal imports
const { addNewLandfill, addLandfillManagers, getAllLandfills, getLandfillByID, getUnassignedLandfillManagers } = require("../controllers/landfillController");

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

// get landfill by id
router.get("/:landfillID", getLandfillByID);

// export
module.exports = router;
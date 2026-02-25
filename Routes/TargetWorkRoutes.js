const express = require("express");
const router = express.Router();

const TargetController = require("../controllers/TargetWorkFlowController");

router.post("/createTarget", TargetController.createTarget);

router.get("/getTargetWork/:scopeWorkID", TargetController.getTargetWork);
router.get(
  "/getTargetID/:scopeWorkID/:date",
  TargetController.getTargetWorkScopeID
);
router.get(
  "/getTargetIDWithoutDate/:scopeWorkID",
  TargetController.getTargetWorkScopeIDWithoutDate
);

router.put("/updateTarget/:targetWorkID", TargetController.updateTargetWork);
module.exports = router;

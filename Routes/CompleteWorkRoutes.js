const express = require("express");
const createCompleteWork = require("../controllers/CompleteWorkFlowController");
const route = express.Router();

route.post("/createCompleteWork", createCompleteWork.createCompleteWork);
route.get(
  "/getCompletedWorks/:scopeWorkID/:date",
  createCompleteWork.CompletedWork
);
route.get(
  "/getCompletedWorksWithoutDate/:scopeWorkID",
  createCompleteWork.CompletedWorkWithoutDate
);
route.get(
  "/getTotalWork/:scopeWorkID",
  createCompleteWork.getTotalTarget_CompleteWorkDone
);

route.put(
  "/updateCompleteWork/:targetWorkID",
  createCompleteWork.updateCompleteWork
);

module.exports = route;

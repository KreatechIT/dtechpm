const RequestedItemController = require("../controllers/RequestedItemController");

const express = require("express");
const route = express.Router();

route.post("/createRequisition", RequestedItemController.createRequisitionItem);
route.get(
  "/fetchItemByID_Month/:MaterialRequisitionID/:month",
  RequestedItemController.fetchItemByID_Month
);
route.get(
  "/fetchItemByID_Year/:MaterialRequisitionID/:year",
  RequestedItemController.fetchItemByID_Year
);
route.get(
  "/fetchItemByID/:requestedItemID",
  RequestedItemController.fetchItemByID
);
route.get(
  "/fetchItemByID_Month_Year/:MaterialRequisitionID/:month/:year",
  RequestedItemController.fetchItemByID_Month_Year
);
route.put(
  "/updateRequestedItemInformation/:requestedItemID",
  RequestedItemController.updateRequestedItemInformation
);
route.put(
  "/updateApprovalStatusAll/:MaterialRequisitionID",
  RequestedItemController.updateApprovalStatusAll
);
route.put(
  "/updateApprovalStatusOne/:RequestedItemID",
  RequestedItemController.updateApprovalStatusOne
);
route.delete(
  "/deleteItemOne_ReqID/:requestedItemID",
  RequestedItemController.deleteItemOne_ReqID
);
route.delete(
  "/deleteReqItem_MRID/:MaterialRequisitionID",
  RequestedItemController.deleteReqItem_MRID
);

module.exports = route;

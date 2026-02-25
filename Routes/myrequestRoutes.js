// routes/myrequestRoutes.js
const express = require("express");
const router = express.Router();
const RequestController = require("../controllers/RequestController");
const upload = require("../middleware/upload");

// Add a new request
router.post("/upload", upload.single("Picture"), RequestController.addRequest);
// Get all requests
router.get("/", RequestController.getAllRequests);

// Get request by ID
router.get("/:id", RequestController.getRequestByID);

// Update a request
router.put("/update/:id",upload.single("Picture"), RequestController.updateRequest);

// Delete a request
router.delete("/:id", RequestController.deleteRequest);

// Get requests by ProjectID
router.get("/project/:ProjectID", RequestController.getRequestByProjectID);

// Update requests by ProjectID
router.put(
  "/project/:ProjectID",
  upload.single("Picture"),
  RequestController.updateRequestByProjectID
);

// Delete requests by ProjectID
router.delete(
  "/project/:ProjectID",
  RequestController.deleteRequestByProjectID
);

// Update ReqStatus by ID
router.put("/update/reqstatus/:id", RequestController.updateReqStatusByID);

module.exports = router;

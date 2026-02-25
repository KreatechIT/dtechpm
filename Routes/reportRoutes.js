const express = require("express");
const router = express.Router();
const ReportController = require("../controllers/ReportController");
const upload = require("../middleware/upload");

router.post("/upload", upload.single("Picture"), ReportController.addReport);
router.get("/", ReportController.getAllReports);
router.get("/:id", ReportController.getReportByID);
router.put("/update/:id", upload.single("Picture"), ReportController.updateReport);
router.delete("/:id", ReportController.deleteReport);
router.get("/project/:ProjectID", ReportController.getReportsByProjectID);
router.put("/update-reqstatus/:id", ReportController.updateReqStatus);
router.get("/request/:RequestId", ReportController.getRequestByReportId);

module.exports = router;

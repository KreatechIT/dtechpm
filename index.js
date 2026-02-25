const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");

app.use(cors());
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(express.json());

require("dotenv").config();
const port = process.env.PORT;

const mysql = require("mysql2");
const connection = require("./config/connection");

const admin = require("./Routes/AdminRoutes");
app.use("/admin", admin);

app.get("/", (req, res) => {
  res.send("Message is being shown here. Connected!");
});

app.get("/test-db", (req, res) => {
  connection.query("SELECT 1 + 1 AS result", (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Database connection failed", details: error.message });
    }
    res.json({ message: "Database is working!", result: results[0] });
  });
});

app.use("/uploads", express.static("uploads"));

// Include user routes
const userRoutes = require("./Routes/userRoutes");
app.use("/users", userRoutes);

const projectRoutes = require("./Routes/ProjectRoutes");
app.use("/project", projectRoutes);

const assignedEngineersRoutes = require("./Routes/AssignedEngineer");
app.use("/assign", assignedEngineersRoutes);

const dailyProgress = require("./Routes/DailyProgressRoutes");
app.use("/dailyProgress", dailyProgress);

const scopeWorkRoutes = require("./Routes/scopeWorkRoutes");
// Use your scopeWorkRoutes
app.use("/scope-works", scopeWorkRoutes);

const workQualityRoutes = require("./Routes/workQualityRoutes");
// Use your WorkQuality
app.use("/work-qualities", workQualityRoutes);

const materialRequisition = require("./Routes/MaterialRequisitionRoutes");
app.use("/materialReq", materialRequisition);
const requestedItems = require("./Routes/RequestedItemRoutes");
app.use("/requestedItem", requestedItems);
const ArrivalStatus = require("./Routes/ArrivedStatusRoutes");
app.use("/arrivalStatus", ArrivalStatus);

const QCReport = require("./Routes/QCReportRoutes");
app.use("/QCReport", QCReport);

const Contractor = require("./Routes/ContractorRoutes");
app.use("/contractor", Contractor);

const Worker = require("./Routes/WorkerRoutes");
app.use("/worker", Worker);

const assignWork = require("./Routes/AssignWorkerRoute");
app.use("/assignWorker", assignWork);

const targetWork = require("./Routes/TargetWorkRoutes");
app.use("/workflow", targetWork);

const completeWork = require("./Routes/CompleteWorkRoutes");
app.use("/workflow", completeWork);

const myrequestRoutes = require("./Routes/myrequestRoutes");
app.use("/request", myrequestRoutes);

const report = require("./Routes/reportRoutes");
app.use("/report", report);

// Export for Vercel serverless
module.exports = app;

// Only listen if not in serverless environment
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Connected to port: ${port}`);
  });
}

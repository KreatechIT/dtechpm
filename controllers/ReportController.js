const ReportModel = require("../models/ReportModel");

exports.addReport = async (req, res) => {
  const { RequestId, ProjectID, AssignID ,ReportStatus } = req.body;
  console.log(RequestId, ProjectID, AssignID , ReportStatus);
  const Picture = req.file.filename;

  try {
    await ReportModel.addReport(RequestId, ProjectID, AssignID ,ReportStatus, Picture);
    return res.status(201).json({
      message: "Report added successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getAllReports = async (req, res) => {
  try {
    const [result] = await ReportModel.getAllReports();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getReportByID = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await ReportModel.getReportByID(id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.updateReport = async (req, res) => {
  const { RequestId, ProjectID, ReqStatus } = req.body;
  const { id } = req.params;
  let Picture = null;

  if (req.file) {
    Picture = req.file.filename;
  }

  try {
    await ReportModel.updateReport(RequestId, ProjectID, ReqStatus, Picture, id);
    return res.status(200).json({
      message: "Report updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.deleteReport = async (req, res) => {
  const { id } = req.params;

  try {
    await ReportModel.deleteReport(id);
    return res.status(200).json({
      message: "Report deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getReportsByProjectID = async (req, res) => {
  const { ProjectID } = req.params;

  try {
    const [result] = await ReportModel.getReportsByProjectID(ProjectID);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.updateReqStatus = async (req, res) => {
  const { ReqStatus } = req.body;
  const { id } = req.params;

  try {
    await ReportModel.updateReqStatus(ReqStatus, id);
    return res.status(200).json({
      message: "ReqStatus updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getRequestByReportId = async (req, res) => {
  const { RequestId } = req.params;

  try {
    const [result] = await ReportModel.getRequestByReport(RequestId);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
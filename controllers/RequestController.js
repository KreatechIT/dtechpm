// controllers/RequestController.js
const RequestModel = require("../models/RequestModel");

exports.addRequest = async (req, res) => {
  const { ProjectID, AssignID, ReqStatus } = req.body;
  console.log(ProjectID, AssignID);
  const Picture = req.file.filename;

  try {
    await RequestModel.addRequest(ProjectID, AssignID, ReqStatus, Picture);
    return res.status(201).json({
      message: "Request added successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getRequestByProjectID = async (req, res) => {
  const { ProjectID } = req.params;

  try {
    const [result] = await RequestModel.getRequestByProjectID(ProjectID);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getAllRequests = async (req, res) => {
  try {
    const [result] = await RequestModel.getAllRequests();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getRequestByID = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await RequestModel.getRequestByID(id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.updateRequest = async (req, res) => {
  const { ProjectID, AssignID, ReqStatus } = req.body;
  const { id } = req.params;
  let Picture = null; // Initialize Picture to null

  // Check if req.file exists and is not null
  if (req.file) {
    Picture = req.file.filename;
  }

  try {
    await RequestModel.updateRequest(ProjectID, AssignID, ReqStatus, Picture, id);
    return res.status(200).json({
      message: "Request updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};



exports.deleteRequest = async (req, res) => {
  const { id } = req.params;

  try {
    await RequestModel.deleteRequest(id);
    return res.status(200).json({
      message: "Request deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.updateRequestByProjectID = async (req, res) => {
  const { AssignID, ReqStatus } = req.body;
  const { ProjectID } = req.params;
  const Picture = req.file.filename;

  try {
    await RequestModel.updateRequestByProjectID(
      ProjectID,
      AssignID,
      ReqStatus,
      Picture
    );
    return res.status(200).json({
      message: "Requests updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.deleteRequestByProjectID = async (req, res) => {
  const { ProjectID } = req.params;

  try {
    await RequestModel.deleteRequestByProjectID(ProjectID);
    return res.status(200).json({
      message: "Requests deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.updateReqStatusByID = async (req, res) => {
  const { id } = req.params;
  const { ReqStatus } = req.body;

  try {
    await RequestModel.updateReqStatusByID(id, ReqStatus);
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

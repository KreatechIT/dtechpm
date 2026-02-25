const RequestedItemModel = require("../models/RequestedItemModel");
const AssignedEngineerModel = require("../models/AssignEngineerModel");
const ProjectModel = require("../models/ProjectModel");
const MaterialRequisitionModel = require("../models/MaterialRequisitionModel");

function validateExpectedDate(expectedDate) {
  validateDate = /^\d{4}-\d{2}-\d{2}$/;

  if (!validateDate.test(expectedDate)) return false;
  else return true;
}

exports.createRequisitionItem = async (req, res) => {
  const {
    MaterialRequisitionID,
    ItemName,
    AmountExpected,
    ExpectedDate,
    Thickness,
    Size,
    remarks,
  } = req.body;

  if (isNaN(MaterialRequisitionID)) {
    return res.status(400).json({
      message: `Bad Request: Missing Required Fields`,
      MaterialRequisitionID: MaterialRequisitionID,
      TypeMR: typeof MaterialRequisitionID,
    });
  }
  try {
    const [fetchedData] = await MaterialRequisitionModel.fetchByMRID(
      MaterialRequisitionID
    );

    if (fetchedData.length === 0) {
      return res.status(404).json({
        message: `404: No Requisition found`,
      });
    }

    if (!validateExpectedDate(ExpectedDate)) {
      return res.status(400).json({
        message: `Bad Request: Expected Date format incorrect.\nFormat: YYYY-MM-DD`,
      });
    }

    const getDateObj = new Date(ExpectedDate);
    const ExpectedMonth = getDateObj.toLocaleString("default", {
      month: "long",
    });
    const ExpectedYear = getDateObj.getFullYear();

    await RequestedItemModel.createItemRequest(
      MaterialRequisitionID,
      ItemName,
      AmountExpected,
      ExpectedDate,
      ExpectedMonth,
      ExpectedYear,
      Thickness,
      Size,
      remarks
    );

    return res
      .status(201)
      .json({ message: "Material Requisition created successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};
exports.fetchItemByID_Month = async (req, res) => {
  const { MaterialRequisitionID, month } = req.params;

  try {
    const result = await RequestedItemModel.getItemInfoByIDandMonth(
      MaterialRequisitionID,
      month
    );

    if (result[0].length === 0) {
      return res.status(404).json({
        error: "No data found for the given MaterialRequisitionID and month.",
      });
    }

    return res.status(200).json(result[0]);
  } catch (error) {
    console.error("Error fetching item information:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

exports.fetchItemByID_Year = async (req, res) => {
  try {
    const { MaterialRequisitionID, year } = req.params;

    if (!MaterialRequisitionID || !year) {
      return res
        .status(400)
        .json({ error: "MaterialRequisitionID, and year are required." });
    }

    const result = await RequestedItemModel.getItemInfoByIDandMonthYear(
      MaterialRequisitionID,
      year
    );

    if (result[0].length === 0) {
      return res.status(404).json({
        error: "No data found for the given MaterialRequisitionID, and year.",
      });
    }

    return res.status(200).json(result[0]);
  } catch (error) {
    console.error("Error fetching item information:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

exports.fetchItemByID_Month_Year = async (req, res) => {
  try {
    const { MaterialRequisitionID, month, year } = req.params;

    console.log(MaterialRequisitionID, month, year);

    if (!MaterialRequisitionID || !year) {
      return res
        .status(400)
        .json({ error: "MaterialRequisitionID, and year are required." });
    }

    const result = await RequestedItemModel.getItemInfoByID_Month_Year(
      MaterialRequisitionID,
      month,
      year
    );

    if (result[0].length === 0) {
      return res.status(404).json({
        error: "No data found for the given MaterialRequisitionID, and year.",
      });
    }

    return res.status(200).json(result[0]);
  } catch (error) {
    console.error("Error fetching item information:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

exports.fetchItemByID = async (req, res) => {
  const { requestedItemID } = req.params;

  if (isNaN(requestedItemID)) {
    return res.status(400).json({
      message: `Bad Request: Missing Required Fields`,
      requestedItemID: requestedItemID,
      TypeMR: typeof requestedItemID,
    });
  }

  try {
    const result = await RequestedItemModel.fetchByItemID(requestedItemID);
    if (result[0].length === 0) {
      return res.status(404).json({
        error: "No data found for the given MaterialRequisitionID, and year.",
      });
    }

    return res.status(200).json(result[0]);
  } catch (error) {
    console.error("Error fetching item information:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

exports.updateRequestedItemInformation = async (req, res) => {
  const { requestedItemID } = req.params;
  const {
    ItemName,
    AmountExpected,
    ExpectedDate,
    Thickness,
    SIZE,
    Unit,
    remarks,
  } = req.body;
  console.log(requestedItemID);
  console.log(req.body);

  if (isNaN(requestedItemID)) {
    return res.status(400).json({
      message: `Bad Request: Missing Required Fields`,
      requestedItemID: requestedItemID,
      TypeMR: typeof requestedItemID,
    });
  }

  try {
    if (!validateExpectedDate(ExpectedDate)) {
      return res.status(400).json({
        message: `Bad Request: Expected Date format incorrect.\nFormat: YYYY-MM-DD`,
      });
    }

    const getDateObj = new Date(ExpectedDate);
    const ExpectedMonth = getDateObj.toLocaleString("default", {
      month: "long",
    });
    const ExpectedYear = getDateObj.getFullYear();

    const [updateResult] =
      await RequestedItemModel.updateRequestedItemInformation(
        ItemName,
        AmountExpected,
        ExpectedDate,
        ExpectedMonth,
        ExpectedYear,
        Thickness,
        SIZE,
        Unit,
        remarks,
        requestedItemID
      );
    if (updateResult.changedRows === 0) {
      if (updateResult.affectedRows === 0) {
        return res.status(404).json({
          message: `404: No Rows Matched`,
          Info: updateResult.Info,
        });
      }
      return res.status(304).json({
        message: "Not Modified",
      });
    }
    return res.status(200).json({
      message: `Successful: ${updateResult.info}`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};
exports.updateApprovalStatusAll = async (req, res) => {
  const { MaterialRequisitionID } = req.params;
  const { ApprovalStatus } = req.body;

  try {
    const updateResult = await RequestedItemModel.updateApprovalStatusAll(
      ApprovalStatus,
      MaterialRequisitionID
    );

    if (updateResult.changedRows === 0) {
      if (updateResult.affectedRows === 0) {
        return res.status(404).json({
          message: `404: No Rows Matched for MaterialRequisitionID ${MaterialRequisitionID}`,
        });
      }
      return res.status(304).json({
        message: "Not Modified",
      });
    }

    return res.status(200).json({
      message: `Successful: ${updateResult.info}`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

exports.updateApprovalStatusOne = async (req, res) => {
  const { RequestedItemID } = req.params;
  const { ApprovalStatus } = req.body;

  try {
    const updateResult = await RequestedItemModel.updateApprovalStatusOne(
      ApprovalStatus,
      RequestedItemID
    );

    if (updateResult.changedRows === 0) {
      if (updateResult.affectedRows === 0) {
        return res.status(404).json({
          message: `404: No Rows Matched for RequestedItemID ${RequestedItemID}`,
        });
      }
      return res.status(304).json({
        message: "Not Modified",
      });
    }

    return res.status(200).json({
      message: `Successful: ${updateResult.info}`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};
exports.deleteItemOne_ReqID = async (req, res) => {
  const { requestedItemID } = req.params;

  if (isNaN(requestedItemID)) {
    return res.status(400).json({
      message: `Bad Request: Missing Required Fields`,
      requestedItemID: requestedItemID,
      TypeMR: typeof requestedItemID,
    });
  }

  try {
    await QCModel.deleteQCReport(reqItemID);
    const [result] =
      await RequestedItemModel.deleteRequestItem_ReqID(requestedItemID);

    if (result[0].affectedRows < 1)
      return res.status(404).json({
        message: `404: No Requested Items found`,
      });

    return res.status(200).json({
      message: `Successfull: Item Deleted`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};
exports.deleteReqItem_MRID = async (req, res) => {
  const { MaterialRequisitionID } = req.params;

  if (isNaN(MaterialRequisitionID)) {
    return res.status(400).json({
      message: `Bad Request: Missing Required Fields`,
      MaterialRequisitionID: MaterialRequisitionID,
      TypeMR: typeof MaterialRequisitionID,
    });
  }

  try {
    const [requestedIDArr] = await RequestedItemModel.fetchRequestIDByMRID(
      MaterialRequisitionID
    );

    for (const iterator of requestedIDArr) {
      const reqItemID = iterator.RequestedItemID;
      const [data] = await QCModel.deleteQCReport(reqItemID);
    }
    await RequestedItemModel.deleteRequestItem_MRID(MaterialRequisitionID);
    return res.status(200).json({
      message: `Successfull: All Items deleted`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

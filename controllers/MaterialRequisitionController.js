const MaterialRequisitionModel = require("../models/MaterialRequisitionModel");
const RequestedItemModel = require("../models/RequestedItemModel");
const AssignedEngineerModel = require("../models/AssignEngineerModel");
const ProjectModel = require("../models/ProjectModel");

function validateExpectedDate(expectedDate) {
  validateDate = /^\d{4}-\d{2}-\d{2}$/;
  // /^\d{4}-\d{2}-\d{2}$/;

  if (!validateDate.test(expectedDate)) return false;
  else return true;
}

exports.createRequisition = async (req, res) => {
  const { ProjectID, AssignID, itemArr } = req.body;
  console.log({ ProjectID, AssignID, itemArr });
  if (isNaN(ProjectID) || isNaN(AssignID)) {
    return res.status(400).json({
      message: `Bad Request: Missing Required Fields`,
      ProjectID: ProjectID,
      TypeProject: typeof ProjectID,
      AssignID: AssignID,
      TypeAssign: typeof AssignID,
    });
  }

  try {
    const createMR = await MaterialRequisitionModel.createRequisition(
      ProjectID,
      AssignID
    );
    console.log({ createMR });
    const MaterialRequisitionID = createMR[0].insertId;
    console.log({ MaterialRequisitionID });

    for (const element of itemArr) {
      console.log(element);
      const [
        ItemName,
        AmountExpected,
        ExpectedDate,
        Thickness,
        Size,
        Unit,
        remarks,
      ] = element;
      console.log(Unit);

      if (!validateExpectedDate(ExpectedDate)) {
        return res.status(400).json({
          message: `Bad Request: Expected Date format incorrect.\nFormat: YYYY-MM-DD`,
        });
      }
      // const [ExpectedMonth, ExpectedYear] = getMonth_Year(ExpectedDate);
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
        Unit,
        remarks
      );
    }

    return res
      .status(201)
      .json({ message: "Material Requisition created successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

exports.getAllByMRID = async (req, res) => {
  const { MaterialRequisitionID } = req.params;

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

    const AssignID = fetchedData[0].AssignID;
    const ProjectID = fetchedData[0].ProjectID;
    const ReqStatus = fetchedData[0].ReqStatus;
    console.log(AssignID);

    const [projectName] = await ProjectModel.fetchProjectName(ProjectID);
    const [assignedEngineerName] =
      await AssignedEngineerModel.fetchUserNameByAssignID(AssignID);

    const [requestedItems] = await RequestedItemModel.fetchByMRID(
      MaterialRequisitionID
    );
    return res.status(201).json({
      projectName: projectName[0].Name,
      assignedEngineerName: assignedEngineerName[0].Name,
      ReqStatus: ReqStatus,
      RequestedItems: requestedItems,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

exports.getAllMRbyProjectID = async (req, res) => {
  const { ProjectID } = req.params;

  if (isNaN(ProjectID)) {
    return res.status(400).json({
      message: `Bad Request: Missing Required Fields`,
      ProjectID: ProjectID,
      TypeProject: typeof ProjectID,
    });
  }

  try {
    const [MRData] = await MaterialRequisitionModel.fetchByProject(ProjectID);

    if (MRData.length === 0) {
      return res.status(404).json({
        message: `404: No Requisition found`,
      });
    }

    const [requestedItems] = await RequestedItemModel.fetchByMRID(
      MRData[0].MaterialRequisitionID
    );

    let requestItemArr = [];
    for (const iterator of MRData) {
      const MR_ID = iterator.MaterialRequisitionID;
      const assignID = iterator.AssignID;
      const reqStatus = iterator.ReqStatus;

      const [assignedEngineerName] =
        await AssignedEngineerModel.fetchUserNameByAssignID(assignID);
      const [tempData] = await RequestedItemModel.fetchByMRID(MR_ID);
      console.log(tempData);
      requestItemArr.push({
        MR_ID: MR_ID,
        AssignedID: assignID,
        reqStatus: reqStatus,
        Name: assignedEngineerName[0].Name,
        Data: tempData,
      });
    }

    return res.status(201).json({
      requestItemArr,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
exports.updateRequisitionStatus = async (req, res) => {
  const { MaterialRequisitionID } = req.params;
  const { status } = req.body;

  if (isNaN(MaterialRequisitionID) || isNaN(status)) {
    return res.status(400).json({
      message: `Bad Request: Missing Required Fields`,
      MaterialRequisitionID: MaterialRequisitionID,
      TypeMR: typeof MaterialRequisitionID,
      status: status,
      StatusType: typeof status,
    });
  }

  try {
    const [updateResult] =
      await MaterialRequisitionModel.updateRequisitionStatusAndRemarks(
        MaterialRequisitionID,
        status
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

exports.fetchMAByProject_Status = async (req, res) => {
  const { ProjectID } = req.params;
  const { status } = req.query;
  console.log(status);
  if (isNaN(ProjectID)) {
    return res.status(400).json({
      message: `Bad Request: Missing Required Fields`,
      ProjectID: ProjectID,
      TypeProject: typeof ProjectID,
    });
  }

  try {
    const [MRData] = await MaterialRequisitionModel.fetchByProjectID_Status(
      ProjectID,
      status
    );

    if (MRData.length === 0) {
      return res.status(404).json({
        message: `404: No Requisition found`,
      });
    }

    const [requestedItems] = await RequestedItemModel.fetchByMRID(
      MRData[0].MaterialRequisitionID
    );

    let requestItemArr = [];
    for (const iterator of MRData) {
      const MR_ID = iterator.MaterialRequisitionID;
      const assignID = iterator.AssignID;
      const reqStatus = iterator.ReqStatus;

      const [assignedEngineerName] =
        await AssignedEngineerModel.fetchUserNameByAssignID(assignID);
      const [tempData] = await RequestedItemModel.fetchByMRID(MR_ID);
      console.log(tempData);
      requestItemArr.push({
        MR_ID: MR_ID,
        AssignedID: assignID,
        reqStatus: reqStatus,
        Name: assignedEngineerName[0].Name,
        Data: tempData,
      });
    }

    return res.status(201).json({
      requestItemArr,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
// call this after requestModel.deleteReqItem_MRID
exports.deleteMR_MRID = async (req, res) => {
  const { MaterialRequisitionID } = req.params;

  if (isNaN(MaterialRequisitionID))
    return res.status(400).json({
      message: `Bad Request: Missing Required Fields`,
      MaterialRequisitionID: MaterialRequisitionID,
      TypeMR: typeof MaterialRequisitionID,
    });

  try {
    const [result] = await MaterialRequisitionModel.deleteMR_MRID(
      MaterialRequisitionID
    );
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

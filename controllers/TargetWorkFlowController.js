const CompleteWorkFlowModel = require("../models/CompleteWorkFlowModel");
const TargetWorkModel = require("../models/TargetWorkModel");

function validateExpectedDate(expectedDate) {
  validateDate = /^\d{4}-\d{2}-\d{2}$/;
  // /^\d{4}-\d{2}-\d{2}$/;

  if (!validateDate.test(expectedDate)) return false;
  else return true;
}

exports.createTarget = async (req, res) => {
  const { workID, amount, date } = req.body;

  if (validateExpectedDate(date) === false) {
    if (!validateExpectedDate(date)) {
      return res.status(400).json({
        message: `Bad Request: Expected Date format incorrect.\nFormat: YYYY-MM-DD`,
      });
    }
  }

  if (isNaN(workID)) {
    return res.status(400).json({
      message: `Bad Request: Missing Required Fields`,
      workID: workID,
      TypeProject: typeof workID,
    });
  }

  try {
    const getDateObj = new Date(date);
    const month = getDateObj.toLocaleString("default", { month: "long" });
    const year = getDateObj.getFullYear();

    let remaining = 0;

    const [getRemainingList] = await TargetWorkModel.getRemainingList(workID);
    console.log(getRemainingList);
    if (getRemainingList.length === 0) {
      await TargetWorkModel.createTargetWork(
        workID,
        amount,
        date,
        month,
        year,
        amount
      );

      await TargetWorkModel.createRemaining(amount, workID);
      return res.status(201).json({
        message: `Successful: Target added`,
      });
    }

    for (const iterator of getRemainingList) {
      if (iterator.completedAmount === null) iterator.completedAmount = 0;
      if (iterator.targetAmount === null) iterator.targetAmount = 0;

      remaining =
        remaining + (iterator.targetAmount - iterator.completedAmount);
    }

    remaining += amount;

    console.log("remaining", remaining);
    await TargetWorkModel.createTargetWork(workID, amount, date, month, year);
    await TargetWorkModel.updateRemaining(remaining, workID);

    return res.status(201).json({
      message: `Successful: Target added`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

exports.updateTargetWork = async (req, res) => {
  const { targetWorkID } = req.params;

  if (!targetWorkID) {
    return res.status(400).json({
      message: `Bad Request: Missing Required Fields`,
      targetWorkID: targetWorkID,
      TypeProject: typeof targetWorkID,
    });
  }

  const { workID, amount, date } = req.body;
  // console.log({workID,amount,date});
  if (validateExpectedDate(date) === false) {
    if (!validateExpectedDate(date)) {
      return res.status(400).json({
        message: `Bad Request: Expected Date format incorrect.\nFormat: YYYY-MM-DD`,
      });
    }
  }
  const targetWork = parseInt(targetWorkID, 10);
  if (isNaN(targetWork)) {
    return res.status(400).json({
      message: `Bad Request: Missing Required Fields`,
      targetWork: targetWork,
      TypeProject: typeof targetWork,
    });
  }

  console.log("targetWork", targetWork, typeof targetWork);

  try {
    const getDateObj = new Date(date);
    const month = getDateObj.toLocaleString("default", { month: "long" });
    const year = getDateObj.getFullYear();

    let [updateResult] = await TargetWorkModel.updateTargetWork(
      targetWork,
      amount,
      date,
      month,
      year
    );

    console.log(updateResult);
    // if (updateResult.changedRows === 0){
    //     if (updateResult.affectedRows === 0){
    //         return res.status(404).json({
    //             message:`404: No Rows Matched`,
    //             Info: updateResult.Info
    //         });
    //     }
    //     return res.status(304).json({
    //         message: 'Not Modified'
    //     });
    // }

    let remaining = 0;
    const [getRemainingList] = await TargetWorkModel.getRemainingList(workID);

    for (const iterator of getRemainingList) {
      if (iterator.completedAmount === null) iterator.completedAmount = 0;
      if (iterator.targetAmount === null) iterator.targetAmount = 0;

      remaining =
        remaining + (iterator.targetAmount - iterator.completedAmount);
    }

    remaining += amount;
    console.log("remaining", remaining);

    await TargetWorkModel.updateRemaining(remaining, workID);

    return res.status(200).json({
      message: `Successful: ${updateResult.info}`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

exports.getTargetWork = async (req, res) => {
  const { scopeWorkID } = req.params;

  if (isNaN(scopeWorkID)) {
    return res.status(400).json({
      message: `Bad Request: Missing Required Fields`,
      scopeWorkID: scopeWorkID,
      TypeProject: typeof scopeWorkID,
    });
  }

  try {
    const [targetWorkData] = await TargetWorkModel.getTargetWork(scopeWorkID);
    console.log(targetWorkData);

    return res.status(200).json(targetWorkData);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};
exports.getTargetWorkScopeID = async (req, res) => {
  const { scopeWorkID, date } = req.params;
  if (isNaN(scopeWorkID)) {
    return res.status(400).json({
      message: `Bad Request: Missing Required Fields`,
      scopeWorkID: scopeWorkID,
      TypeProject: typeof scopeWorkID,
    });
  }

  try {
    const [targetWorkData] = await TargetWorkModel.getTargetID(
      scopeWorkID,
      date
    );
    console.log(targetWorkData);

    return res.status(200).json(targetWorkData);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

exports.getTargetWorkScopeIDWithoutDate = async (req, res) => {
  const { scopeWorkID } = req.params;
  if (isNaN(scopeWorkID)) {
    return res.status(400).json({
      message: `Bad Request: Missing Required Fields`,
      scopeWorkID: scopeWorkID,
      TypeProject: typeof scopeWorkID,
    });
  }

  try {
    const [targetWorkData] =
      await TargetWorkModel.getTargetIDWithoutDate(scopeWorkID);
    console.log(targetWorkData);

    return res.status(200).json(targetWorkData);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

const CompleteWorkFlowModel = require("../models/CompleteWorkFlowModel");
const TargetWorkModel = require("../models/TargetWorkModel");

function validateExpectedDate(expectedDate) {
  validateDate = /^\d{4}-\d{2}-\d{2}$/;

  if (!validateDate.test(expectedDate)) return false;
  else return true;
}

exports.createCompleteWork = async (req, res) => {
  const { targetWorkID, date, amount } = req.body;
  console.log(targetWorkID, amount, date);
  if (validateExpectedDate(date) === false) {
    if (!validateExpectedDate(ExpectedDate)) {
      return res.status(400).json({
        message: `Bad Request: Expected Date format incorrect.\nFormat: YYYY-MM-DD`,
      });
    }
  }
  if (isNaN(targetWorkID)) {
    return res.status(400).json({
      message: `Bad Request: Missing Required Fields`,
      targetWorkID: targetWorkID,
      TypeProject: typeof targetWorkID,
    });
  }

  try {
    const getDateObj = new Date(date);
    const month = getDateObj.toLocaleString("default", { month: "long" });
    const year = getDateObj.getFullYear();

    const [isCompleteWorkExists] =
      await CompleteWorkFlowModel.isCompleteWorkExists(targetWorkID, date);

    if (isCompleteWorkExists.length > 0)
      return res.status(409).json({
        message: `Bad Conflict: Row already in exists for target`,
      });

    await CompleteWorkFlowModel.createCompleteWork(
      targetWorkID,
      amount,
      date,
      month,
      year
    );
    const [scopeWorkDataFetched] =
      await CompleteWorkFlowModel.getScopeWorkID(targetWorkID);
    console.log(scopeWorkDataFetched[0].scopeWorkID);

    const [remaining] = await TargetWorkModel.getRemaining(
      scopeWorkDataFetched[0].scopeWorkID
    );
    console.log(remaining[0]?.remaining);

    const updatedRemaining = remaining[0].remaining - amount;

    console.log("updatedRemaining", updatedRemaining);
    await TargetWorkModel.updateRemaining(
      updatedRemaining,
      scopeWorkDataFetched[0].scopeWorkID
    );
    return res.status(201).json({
      message: `Completed Work Inserted`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

exports.updateCompleteWork = async (req, res) => {
  const { targetWorkID } = req.params;
  const { date, amount } = req.body;
  console.log(targetWorkID, amount, date);
  if (validateExpectedDate(date) === false) {
    if (!validateExpectedDate(ExpectedDate)) {
      return res.status(400).json({
        message: `Bad Request: Expected Date format incorrect.\nFormat: YYYY-MM-DD`,
      });
    }
  }
  if (isNaN(targetWorkID)) {
    return res.status(400).json({
      message: `Bad Request: Missing Required Fields`,
      targetWorkID: targetWorkID,
      TypeProject: typeof targetWorkID,
    });
  }

  try {
    const getDateObj = new Date(date);
    const month = getDateObj.toLocaleString("default", { month: "long" });
    const year = getDateObj.getFullYear();

    const [updateResult] = await CompleteWorkFlowModel.updateCompleteWork(
      targetWorkID,
      amount,
      date,
      month,
      year
    );
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

    const [scopeWorkDataFetched] =
      await CompleteWorkFlowModel.getScopeWorkID(targetWorkID);
    console.log(scopeWorkDataFetched[0].scopeWorkID);

    const [remaining] = await TargetWorkModel.getRemaining(
      scopeWorkDataFetched[0].scopeWorkID
    );
    console.log(remaining[0]?.remaining);

    const updatedRemaining = remaining[0].remaining - amount;

    await TargetWorkModel.updateRemaining(
      updatedRemaining,
      scopeWorkDataFetched[0].scopeWorkID
    );

    return res.status(200).json({
      message: `Successful: ${updateResult.info}`,
    });
  } catch (error) {}
};

exports.CompletedWork = async (req, res) => {
  const { scopeWorkID, date } = req.params;
  if (isNaN(scopeWorkID)) {
    return res.status(400).json({
      message: `Bad Request: Missing Required Fields`,
      scopeWorkID: scopeWorkID,
      TypeProject: typeof scopeWorkID,
    });
  }

  try {
    const [CompletedWorkData] = await CompleteWorkFlowModel.getCompletedWorks(
      scopeWorkID,
      date
    );
    console.log(CompletedWorkData);

    return res.status(200).json(CompletedWorkData);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

exports.CompletedWorkWithoutDate = async (req, res) => {
  const { scopeWorkID } = req.params;
  if (isNaN(scopeWorkID)) {
    return res.status(400).json({
      message: `Bad Request: Missing Required Fields`,
      scopeWorkID: scopeWorkID,
      TypeProject: typeof scopeWorkID,
    });
  }

  try {
    const [CompletedWorkData] =
      await CompleteWorkFlowModel.getCompletedWorksWithoutDate(scopeWorkID);
    console.log(CompletedWorkData);

    return res.status(200).json(CompletedWorkData);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

exports.getTotalTarget_CompleteWorkDone = async (req, res) => {
  const { scopeWorkID } = req.params;
  if (isNaN(scopeWorkID)) {
    return res.status(400).json({
      message: `Bad Request: Missing Required Fields`,
      scopeWorkID: scopeWorkID,
      TypeProject: typeof scopeWorkID,
    });
  }

  try {
    const [workList] = await TargetWorkModel.getRemainingList(scopeWorkID);

    let totalTargetWork = 0;
    let totalCompletedWork = 0;

    for (const iterator of workList) {
      if (iterator.completedAmount === null) iterator.completedAmount = 0;
      if (iterator.targetAmount === null) iterator.targetAmount = 0;

      totalTargetWork += parseInt(iterator.targetAmount);
      // console.log(totalTargetWork);
      totalCompletedWork += parseInt(iterator.completedAmount);
      // console.log(totalCompletedWork);
    }

    return res.status(200).json({
      totalTargetWork,
      totalCompletedWork,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

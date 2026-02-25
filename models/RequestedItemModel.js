const connection = require("../config/connection");

class RequestedItemModel {
  static async createItemRequest(
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
  ) {
    const sqlQuery =
      "INSERT INTO RequestedItem (MaterialRequisitionID, ItemName, AmountExpected, ExpectedDate, ExpectedMonth, ExpectedYear, Thickness, SIZE, Unit, remarks, ApprovalStatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)";
    return await connection
      .promise()
      .query(sqlQuery, [
        MaterialRequisitionID,
        ItemName,
        AmountExpected,
        ExpectedDate,
        ExpectedMonth,
        ExpectedYear,
        Thickness,
        Size,
        Unit,
        remarks,
      ]);
  }
  static async fetchByMRID(MaterialRequisitionID) {
    const sqlQuery =
      "SELECT * FROM RequestedItem WHERE MaterialRequisitionID = ?";
    return await connection.promise().query(sqlQuery, [MaterialRequisitionID]);
  }
  static async fetchByItemID(requestedItemID) {
    const sqlQuery = `SELECT * FROM RequestedItem WHERE RequestedItemID = ?`;
    return await connection.promise().query(sqlQuery, [requestedItemID]);
  }
  static async fetchQCID_RequestedID(MaterialRequisitionID) {
    const sqlQuery = `SELECT RequestedItemID FROM RequestedItem WHERE MaterialRequisitionID = ?`;
    return await connection.promise().query(sqlQuery, [MaterialRequisitionID]);
  }
  static async updateRequestedItemInformation(
    ItemName,
    AmountExpected,
    ExpectedDate,
    ExpectedMonth,
    ExpectedYear,
    Thickness,
    Size,
    Unit,
    remarks,
    requestedItemID
  ) {
    const sqlQuery = `
        UPDATE RequestedItem SET ItemName = ?,
            AmountExpected = ?,
            ExpectedDate = ?,
            ExpectedMonth = ?,
            ExpectedYear = ?,
            Thickness = ?, 
            Size = ?,
            Unit = ?,
            remarks = ?
            WHERE RequestedItemID = ?
    `;
    return await connection
      .promise()
      .query(sqlQuery, [
        ItemName,
        AmountExpected,
        ExpectedDate,
        ExpectedMonth,
        ExpectedYear,
        Thickness,
        Size,
        Unit,
        remarks,
        requestedItemID,
      ]);
  }
  static async updateApprovalStatusAll(ApprovalStatus, MaterialRequisitionID) {
    const sqlQuery = `UPDATE RequestedItem SET ApprovalStatus = ?,
        WHERE MaterialRequisitionID = ?`;
    return await connection
      .promise()
      .query(sqlQuery, [ApprovalStatus, MaterialRequisitionID]);
  }
  static async updateApprovalStatusOne(ApprovalStatus, RequestedItemID) {
    const sqlQuery = `UPDATE RequestedItem SET ApprovalStatus = ?,
        WHERE RequestedItemID = ?`;
    return await connection
      .promise()
      .query(sqlQuery, [ApprovalStatus, RequestedItemID]);
  }
  static async getItemInfoByIDandMonth(MaterialRequisitionID, month) {
    const sqlQuery = `
            SELECT *
            FROM RequestedItem
            WHERE MaterialRequisitionID = ? AND ExpectedMonth = ?
        `;

    return await connection
      .promise()
      .query(sqlQuery, [MaterialRequisitionID, month]);
  }
  static async getItemInfoByIDandMonthYear(MaterialRequisitionID, year) {
    const sqlQuery = `
            SELECT *
            FROM RequestedItem
            WHERE MaterialRequisitionID = ? AND ExpectedYear = ?
        `;

    return await connection
      .promise()
      .query(sqlQuery, [MaterialRequisitionID, year]);
  }
  static async getItemInfoByID_Month_Year(
    MaterialRequisitionID,
    month,
    ExpectedYear
  ) {
    const sqlQuery = `
            SELECT *
            FROM RequestedItem
            WHERE MaterialRequisitionID = ? AND ExpectedMonth = ? AND ExpectedYear = ?
        `;

    return await connection
      .promise()
      .query(sqlQuery, [MaterialRequisitionID, month, ExpectedYear]);
  }
  static async fetchRequestIDByMRID(MaterialRequisitionID) {
    const sqlQuery = `SELECT RequestedItemID FROM RequestedItem WHERE MaterialRequisitionID = ?`;
    return await connection.promise().query(sqlQuery, [MaterialRequisitionID]);
  }
  static async deleteRequestItem_ReqID(RequestedItemID) {
    const sqlQuery = `DELETE FROM RequestedItem WHERE RequestedItemID = ?`;
    return await connection.promise().query(sqlQuery, [RequestedItemID]);
  }
  static async deleteRequestItem_MRID(MaterialRequisitionID) {
    const sqlQuery = `DELETE FROM RequestedItem WHERE MaterialRequisitionID = ?`;
    return await connection.promise().query(sqlQuery, [MaterialRequisitionID]);
  }
}

module.exports = RequestedItemModel;

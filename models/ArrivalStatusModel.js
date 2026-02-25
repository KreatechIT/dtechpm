const connection = require("../config/connection");

class ArrivalStatusModel {
  static async createArrivalStatus(
    RequestedItemID,
    AmountReceived,
    ReceivedDate,
    ReceivedMonth,
    ReceivedYear
  ) {
    const sqlQuery = `INSERT INTO ArrivedItem 
    (RequestedItemID, AmountReceived, ReceivedDate, ReceivedMonth, ReceivedYear)
    VALUES (?, ?, ?, ?, ?, ?)`;
    return await connection
      .promise()
      .query(sqlQuery, [
        RequestedItemID,
        AmountReceived,
        ReceivedDate,
        ReceivedMonth,
        ReceivedYear,
      ]);
  }
  static async fetchArrivalStatusByReqID(RequestedItemID) {
    const sqlQuery = `SELECT * FROM ArrivedItem WHERE RequestedItemID = ?`;
    return await connection.promise().query(sqlQuery, [RequestedItemID]);
  }
  static async updateArrivalStatusByReqID(
    AmountReceived,
    ReceivedDate,
    ReceivedMonth,
    ReceivedYear,
    RequestedItemID
  ) {
    const sqlQuery = `UPDATE ArrivedItem
        SET
          AmountReceived = ?,
          ReceivedDate = ?,
          ReceivedMonth = ?,
          ReceivedYear = ?
        WHERE RequestedItemID = ?;
      `;
    return await connection
      .promise()
      .query(sqlQuery, [
        AmountReceived,
        ReceivedDate,
        ReceivedMonth,
        ReceivedYear,
        RequestedItemID,
      ]);
  }
  static async fetchByStatus_ReqID(requestedItemID, ApprovalStatus) {
    sqlQuery = `SELECT * FROM ArrivedItem WHERE RequestedItemID = ?, ArrivalStatus = ?`;
    return await connection.promise().query(sqlQuery, [requestedItemID, ApprovalStatus]);
  }
}

module.exports = ArrivalStatusModel;

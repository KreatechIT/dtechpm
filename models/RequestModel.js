const db = require("../config/connection");

class RequestModel {
  static async addRequest(ProjectID, AssignID, ReqStatus, Picture) {
    console.log(Picture);
    const sqlQuery =
      "INSERT INTO Request (ProjectID, AssignID, ReqStatus, Picture) VALUES (?, ?, ?, ?)";
    return await db
      .promise()
      .query(sqlQuery, [ProjectID, AssignID, ReqStatus, Picture]);
  }

  static async getRequestByProjectID(ProjectID) {
    const sqlQuery = "SELECT * FROM Request WHERE ProjectID = ?";
    return await db.promise().query(sqlQuery, [ProjectID]);
  }

  static async getAllRequests() {
    const sqlQuery = "SELECT * FROM Request";
    return await db.promise().query(sqlQuery);
  }

  static async getRequestByID(id) {
    const sqlQuery = "SELECT * FROM Request WHERE id = ?";
    return await db.promise().query(sqlQuery, [id]);
  }

  static async updateRequest(ProjectID, AssignID, ReqStatus, Picture, id) {
    let sqlQuery = "UPDATE Request SET ProjectID = ?, AssignID = ?, ReqStatus = ?";
    const queryParams = [ProjectID, AssignID, ReqStatus];

    if (Picture !== null && Picture !== "" && Picture !== undefined) {
      sqlQuery += ", Picture = ?";
      queryParams.push(Picture);
  }

    sqlQuery += " WHERE id = ?";
    queryParams.push(id);

    return await db.promise().query(sqlQuery, queryParams);
}

  static async deleteRequest(id) {
    const sqlQuery = "DELETE FROM Request WHERE id = ?";
    return await db.promise().query(sqlQuery, [id]);
  }

  static async updateRequestByProjectID(
    ProjectID,
    AssignID,
    ReqStatus,
    Picture
  ) {
    const sqlQuery =
      "UPDATE Request SET AssignID = ?, ReqStatus = ?, Picture = ? WHERE ProjectID = ?";
    return await db
      .promise()
      .query(sqlQuery, [AssignID, ReqStatus, Picture, ProjectID]);
  }

  static async deleteRequestByProjectID(ProjectID) {
    const sqlQuery = "DELETE FROM Request WHERE ProjectID = ?";
    return await db.promise().query(sqlQuery, [ProjectID]);
  }

  static async updateReqStatusByID(id, ReqStatus) {
    const sqlQuery = "UPDATE Request SET ReqStatus = ? WHERE id = ?";
    return await db.promise().query(sqlQuery, [ReqStatus, id]);
  }
}

module.exports = RequestModel;

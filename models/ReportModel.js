const db = require("../config/connection");

class ReportModel {
  static async addReport(RequestId, ProjectID, AssignID, ReqStatus, Picture) {
    console.log(RequestId, ProjectID, AssignID ,ReqStatus, Picture)
    const sqlQuery =
      "INSERT INTO Report (RequestId, ProjectID,AssignID ,ReqStatus, Picture) VALUES (?, ?, ?, ?, ?)";
    return await db
      .promise()
      .query(sqlQuery, [RequestId, ProjectID, AssignID ,ReqStatus, Picture]);
  }

  static async getAllReports() {
    const sqlQuery = "SELECT * FROM Report";
    return await db.promise().query(sqlQuery);
  }

  static async getReportByID(id) {
    const sqlQuery = "SELECT * FROM Report WHERE id = ?";
    return await db.promise().query(sqlQuery, [id]);
  }

  static async updateReport(RequestId, ProjectID, ReqStatus, Picture, id) {
    let sqlQuery = "UPDATE Report SET RequestId = ?, ProjectID = ?, ReqStatus = ?";
    const queryParams = [RequestId, ProjectID, ReqStatus];
  
    if (Picture !== null && Picture !== "" && Picture !== undefined) {
      sqlQuery += ", Picture = ?";
      queryParams.push(Picture);
    }
  
    sqlQuery += " WHERE id = ?";
    queryParams.push(id);
  
    return await db.promise().query(sqlQuery, queryParams);
  }

  static async deleteReport(id) {
    const sqlQuery = "DELETE FROM Report WHERE id = ?";
    return await db.promise().query(sqlQuery, [id]);
  }

  static async deleteReport_ProjectID (ProjectID){
    const sqlQuery = "DELETE FROM Report WHERE ProjectID = ?";
    return await db.promise().query(sqlQuery, [ProjectID]);
  }

  static async getReportsByProjectID(ProjectID) {
    const sqlQuery = "SELECT * FROM Report WHERE ProjectID = ?";
    return await db.promise().query(sqlQuery, [ProjectID]);
  }
  static async updateReqStatus(ReqStatus, id) {
    const sqlQuery = "UPDATE Report SET ReqStatus = ? WHERE id = ?";
    return await db.promise().query(sqlQuery, [ReqStatus, id]);
  }
  static async getRequestByReport(RequestId) {
    const sqlQuery = "SELECT * FROM Request WHERE id IN (SELECT RequestId FROM Report WHERE RequestId = ?)";
    return await db.promise().query(sqlQuery, [RequestId]);
  }
}

module.exports = ReportModel;

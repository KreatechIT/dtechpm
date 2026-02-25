const connection = require("../config/connection");

class CompleteWorkFlowModel {
  static async createCompleteWork(targetWork, amount, date, month, year) {
    const sql = `INSERT INTO completeworkflow (targetworkflow_id, amount, date, month, year) VALUE (?, ?, ?, ?, ?)`;
    return await connection
      .promise()
      .query(sql, [targetWork, amount, date, month, year]);
  }

  static async updateCompleteWork(
    targetworkflow_id,
    amount,
    date,
    month,
    year
  ) {
    const sql = `UPDATE completeworkflow
        SET amount = ?, 
            date = ?, 
            month = ?, 
            year = ?
        WHERE targetworkflow_id = ?;`;
    return await connection
      .promise()
      .query(sql, [amount, date, month, year, targetworkflow_id]);
  }

  static async isCompleteWorkExists(targetworkflow_id, date) {
    const sql = `SELECT * FROM completeworkflow WHERE targetworkflow_id = ? AND date = ?`;
    return await connection.promise().query(sql, [targetworkflow_id, date]);
  }

  static async getScopeWorkID(targetID) {
    const sqlQuery = `SELECT targetworkflow.scope_work_id AS scopeWorkID
        FROM targetworkflow
        INNER JOIN completeworkflow
        ON targetworkflow.targetworkflow_id = completeworkflow.targetworkflow_id
        WHERE completeworkflow.targetworkflow_id = ?`;
    return await connection.promise().query(sqlQuery, [targetID]);
  }
  static async getCompletedWorks(scope_work_id, date) {
    const sqlQuery = `select completeworkflow.amount , completeworkflow.targetworkflow_id ,completeworkflow.date from targetworkflow RIGHT JOIN completeworkflow ON 
        targetworkflow.targetworkflow_id = completeworkflow.targetworkflow_id WHERE targetworkflow.scope_work_id = ? and completeworkflow.date = ?`;
    return await connection.promise().query(sqlQuery, [scope_work_id, date]);
  }
  static async getCompletedWorksWithoutDate(scope_work_id) {
    const sqlQuery = `select completeworkflow.amount , completeworkflow.targetworkflow_id ,completeworkflow.date from targetworkflow RIGHT JOIN completeworkflow ON 
        targetworkflow.targetworkflow_id = completeworkflow.targetworkflow_id WHERE targetworkflow.scope_work_id = ?`;
    return await connection.promise().query(sqlQuery, [scope_work_id]);
  }
}

module.exports = CompleteWorkFlowModel;

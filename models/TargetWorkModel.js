const connection = require("../config/connection");

class TargetWorkModel {
  static async createTargetWork(workID, amount, date, month, year) {
    const sqlQuery = `INSERT INTO targetworkflow (scope_work_id, amount, date, month, year) values (?, ?, ?, ?, ?)`;
    return await connection
      .promise()
      .query(sqlQuery, [workID, amount, date, month, year]);
  }

  static async updateTargetWork(targetWorkID, amount, date, month, year) {
    const sqlQuery = `
        UPDATE targetworkflow
        SET amount = ?, 
            date = ?, 
            month = ?, 
            year = ?
        WHERE targetworkflow_id = ?`;
    return await connection
      .promise()
      .query(sqlQuery, [amount, date, month, year, targetWorkID]);
  }

  static async getRemainingList(scope_work_id) {
    const sqlQuery = `SELECT 
        targetworkflow.amount as targetAmount, completeworkflow.amount as completedAmount
        FROM targetworkflow
        LEFT JOIN completeworkflow
        ON targetworkflow.targetworkflow_id = completeworkflow.targetworkflow_id
        WHERE scope_work_id = ?`;
    return await connection.promise().query(sqlQuery, [scope_work_id]);
  }

  static async getTotalRemaining(scope_work_id) {
    const sqlQuery = `SELECT sqrfoot FROM scopework WHERE WorkID = ?`;
    return await connection.promise().query(sqlQuery, [scope_work_id]);
  }

  static async updateRemaining(remaining, scope_work_id) {
    const sqlQuery = `UPDATE remaining
        SET remaining = ?
        WHERE scopeWorkID = ?`;

    return await connection
      .promise()
      .query(sqlQuery, [remaining, scope_work_id]);
  }

  static async createRemaining(remaining, scope_work_id) {
    const sqlQuery = `INSERT INTO remaining (remaining, scopeWorkID) VALUES (?, ?)`;
    return await connection
      .promise()
      .query(sqlQuery, [remaining, scope_work_id]);
  }

  static async getRemaining(scope_work_id) {
    const sqlQuery = `SELECT remaining FROM remaining WHERE scopeWorkID = ?`;
    return await connection.promise().query(sqlQuery, [scope_work_id]);
  }
  static async getTargetID(scope_work_id, date) {
    const sqlQuery = `SELECT * FROM targetworkflow WHERE scope_work_id = ? AND date = ?`;
    return await connection.promise().query(sqlQuery, [scope_work_id, date]);
  }
  static async getTargetIDWithoutDate(scope_work_id) {
    const sqlQuery = `SELECT * FROM targetworkflow WHERE scope_work_id = ?`;
    return await connection.promise().query(sqlQuery, [scope_work_id]);
  }
  static async getTargetWork(scope_work_id) {
    const sqlQuery = `SELECT targetworkflow.targetworkflow_id AS targetID, targetworkflow.amount as targetAmount, targetworkflow.date as targetDate,
        targetworkflow.month as targetMonth, targetworkflow.year as targetYear, remaining.remaining, completeworkflow.completeworkflow_id as completeWorkID, completeworkflow.amount AS completeAmount, 
        completeworkflow.date AS completeDate, completeworkflow.month AS completeMonth, completeworkflow.year AS completeYear 
        FROM targetworkflow
        INNER JOIN remaining
        ON remaining.scopeWorkID = targetworkflow.scope_work_id
        LEFT JOIN completeworkflow
        ON targetworkflow.targetworkflow_id = completeworkflow.targetworkflow_id
        WHERE scope_work_id = ?
        `;

    return await connection.promise().query(sqlQuery, [scope_work_id]);
  }
}

module.exports = TargetWorkModel;

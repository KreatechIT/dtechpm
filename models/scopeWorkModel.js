const db = require('../config/connection');

class ScopeWork {
  createScopeWork(scopeWork) {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO ScopeWork SET ?', [scopeWork], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
  getScopeOfWorkByProjectId(ProjectId){
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM ScopeWork WHERE ProjectID = ?', [ProjectId], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
  getScopeWorkById(id) {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM ScopeWork WHERE WorkID = ?', [id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  updateScopeWork(id, scopeWork) {
    return new Promise((resolve, reject) => {
      db.query('UPDATE ScopeWork SET ? WHERE WorkID = ?', [scopeWork, id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
  updateStatusScopeWork(id,scopeWork){
    return new Promise((resolve, reject) => {
      db.query('UPDATE ScopeWork SET ? WHERE WorkID = ?', [scopeWork, id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
  deleteScopeWork(id) {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM ScopeWork WHERE WorkID = ?', [id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  getAllScopeWork() {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM ScopeWork', (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  getScopeWorkByProject(id) {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM ScopeWork WHERE ProjectID = ?', [id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
  async getScopeWorkNameByID(scopeWorkID){
    const sqlQuery = "SELECT Work_Name as Name FROM ScopeWork WHERE WorkID = ?";
    return await db.promise().query(sqlQuery, [scopeWorkID]);
  }

}




module.exports = new ScopeWork();

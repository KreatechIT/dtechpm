const db = require('../config/connection');

class WorkQuality {
  static async AddWorkQuality(ProjectID, WorkID, WorkName, Current_Date ,TotalWork, Allignment, Accesories, SiliconIn, SiliconOut, Behaviour, Comment) {
    const sqlQuery = "INSERT INTO Work_Quality (ProjectID, WorkID, WorkName, Curent_Date ,TotalWork, Allignment, Accesories, SiliconIn, SiliconOut, Behaviour, Comment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    return await db.promise().query(sqlQuery, [ProjectID, WorkID, WorkName, Current_Date ,TotalWork, Allignment, Accesories, SiliconIn, SiliconOut, Behaviour, Comment])
  }

  static async getWorkQualityById(id) {
    const sqlQuery = `SELECT ProjectID, WorkName, TotalWork, Allignment, Curent_Date , Accesories, SiliconIn, SiliconOut, Behaviour, Comment FROM Work_Quality WHERE WorkQualityID = ?`;
    return await db.promise().query(sqlQuery, [id]);
  }

  static async updateWorkQuality(id, TotalWork, Allignment, Curent_Date, Accesories, SiliconIn, SiliconOut, Behaviour, Comment) {
    return await db.promise().query('UPDATE Work_Quality SET TotalWork = ?, Allignment = ?, Curent_Date = ?, Accesories = ?, SiliconIn = ?, SiliconOut = ?, Behaviour = ?, Comment = ? WHERE WorkQualityID = ?', [TotalWork, Allignment, Curent_Date , Accesories, SiliconIn, SiliconOut, Behaviour, Comment, id]);
  };
  static async deleteWorkQuality(id) {
    return await db.promise().query('DELETE FROM Work_Quality WHERE WorkQualityID = ?', [id]);
  }

  static async getAllWorkQuality() {
    return await db.promise().query('SELECT ProjectID, WorkID, WorkName, Curent_Date , TotalWork, Allignment, Accesories, SiliconIn, SiliconOut, Behaviour, Comment FROM Work_Quality');
  }

  static async getWorkQualityByProject(id) {
    return await db.promise().query('SELECT * FROM Work_Quality WHERE ProjectID = ?',[id]);
  }

  static async getWorkQualityByScopeWorkID(scopeWorkID){
    const sqlQuery = "SELECT * FROM Work_Quality WHERE WorkID = ?";
    return await db.promise().query(sqlQuery, [scopeWorkID]);
  }
   
}

module.exports = WorkQuality;

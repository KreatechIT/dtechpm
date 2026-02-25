const connection = require('../config/connection');

class DailyProgressModel{
    static async logProgress(name, details, media, date, projectID){
        const sqlQuery = "INSERT INTO DAILY_PROGRESS (Name, DETAILS, MEDIA, Date, ProjectID) VALUES (?, ?, ?, ?, ?)";
        try{
            return await connection.promise().query(sqlQuery, [name, details, media, date, projectID]);
        } catch (error){
            throw new Error(`Failed to log progress: ${error}`);
        }
    }

    static async updateProgressById(progressId, name, details, date) {
        const sqlQuery = "UPDATE DAILY_PROGRESS SET Name = ?, DETAILS = ?, Date = ? WHERE ProgressID = ?";
        try {
            return await connection.promise().query(sqlQuery, [name, details, date, progressId]);
        } catch (error) {
            throw new Error(`Failed to update progress by ID ${progressId}: ${error}`);
        }
    }
};

module.exports = DailyProgressModel;
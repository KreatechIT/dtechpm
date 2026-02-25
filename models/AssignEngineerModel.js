const connection = require('../config/connection');

class AssignEngineer{
    static async assignEngineer(userID, projectID){
        const sql = "INSERT INTO AssignEngineer (UserID, Project_ID) VALUES (?, ?)";
        return await connection.promise().query(sql, [userID, projectID]);
    };

    static async fetchAssignID_userID(userID){
        const sql = "SELECT AssignID FROM AssignEngineer WHERE UserID = ?";
        return await connection.promise().query(sql, [userID]);
    }

    static async fetchEngineerByProject(projectID){
        const sql = "SELECT UserID FROM AssignEngineer WHERE Project_ID = ?";
        return await connection.promise().query(sql, [projectID]);
    };

    static async fetchProjectByEngineer(userID){
        const sql = "SELECT Project_ID as Projects FROM AssignEngineer WHERE UserID = ?";
        return await connection.promise().query(sql,[userID]);
    };

    static async deleteAssignEngineer(userID, projectID){
        const sql = "DELETE FROM AssignEngineer WHERE UserID = ? AND Project_ID = ?";
        return await connection.promise().query(sql, [userID, projectID]);
    }

    static async fetchAllAssignedEngineers(){
        const sql = "SELECT * FROM AssignEngineer";
        return await connection.promise().query(sql);
    }
    static async fetchAllProjectID(){
        const sqlQuery = "SELECT DISTINCT Project_ID FROM AssignEngineer;"
        return await connection.promise().query(sqlQuery);
    }
    static async fetchAllNotUsersByProjectID(projectID){
        const sqlQuery = "SELECT UserID From User WHERE UserID NOT IN (SELECT UserID FROM AssignEngineer WHERE Project_ID = ?)";
        return await connection.promise().query(sqlQuery, [projectID]);
    }
    static async deleteAllAssignedByProject(projectID){
        const sqlQuery = "DELETE FROM AssignEngineer WHERE Project_ID = ?"
        return await connection.promise().query(sqlQuery, [projectID]);
    }
    static async deleteAllAssignedByUser(userID){
        const sqlQuery = "DELETE FROM AssignEngineer WHERE UserID = ?";
        return await connection.promise().query(sqlQuery, [userID]);
    }
    static async fetchUserNameByAssignID(AssignID){
        const sqlQuery = "SELECT Name FROM User WHERE UserId = (SELECT UserID FROM AssignEngineer WHERE AssignID = ?)";
        return await connection.promise().query(sqlQuery, [AssignID]);
    }
    static async fetchAssignID_UserIDProjectID(UserID, ProjectID){
        const sqlQuery = `SELECT AssignID FROM AssignEngineer WHERE UserID = ? AND Project_ID = ?`;
        return await connection.promise().query(sqlQuery, [UserID, ProjectID]);
    }
    static async fetchAssignAndUserID_ProjectID( projectID )
    {
        const sqlQuery = `SELECT AssignID, UserID FROM AssignEngineer WHERE Project_ID = ?`;
        return await connection.promise().query(sqlQuery, [projectID]);
    }
    static async fetchUserIDName_AssignID (AssignID){
        const sqlQuery = `SELECT User.name, User.UserID
        FROM User
        INNER JOIN AssignEngineer
        ON User.UserID = AssignEngineer.UserID
        WHERE AssignID = ?`;
        return await connection.promise().query(sqlQuery, [AssignID]);
    }
};

module.exports = AssignEngineer;
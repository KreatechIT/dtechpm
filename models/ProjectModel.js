const connection = require('../config/connection');

class ProjectModel{
    static async createProject(name, details, startDate, endDate, location, status, file){
        const sqlQuery = "INSERT INTO Project (ProjectName, Details, Start_Date, End_Date, Location, Status, Uploads) VALUES (?, ?, ?, ?, ?, ?, ?)";
        console.log("With parameters:", [name, details, startDate, endDate, location, status, file]);
        return await connection.promise().query(sqlQuery, [name, details, startDate, endDate, location, status, file]);
    };

    static async fetchProjectByID(projectID){
        const sqlQuery = "SELECT * FROM Project WHERE ProjectID = ?";
        return await connection.promise().query(sqlQuery, [projectID]);
    };

    static async fetchProjectName(projectID){
        const sqlQuery = "SELECT ProjectName as Name FROM Project WHERE ProjectID=?"
        return await connection.promise().query(sqlQuery, [projectID]);
    }
    static async fetchAllProjectByStatus(status){
        const sqlQuery = "SELECT * FROM Project WHERE Status = ?";
        return await connection.promise().query(sqlQuery, [status]);
    }
    static async updateProjectByProjectID(ProjectName, Details, Start_Date, End_Date, Location, file, projectID){
        let sqlQuery;
        let queryParams;
    
        if (file) {
            sqlQuery = "UPDATE Project SET ProjectName = ?, Details = ?, Start_Date = ?, End_Date = ?, Location = ?, Uploads = ? WHERE ProjectID = ?";
            queryParams = [ProjectName, Details, Start_Date, End_Date, Location, file, projectID];
        } else {
            sqlQuery = "UPDATE Project SET ProjectName = ?, Details = ?, Start_Date = ?, End_Date = ?, Location = ? WHERE ProjectID = ?";
            queryParams = [ProjectName, Details, Start_Date, End_Date, Location, projectID];
        }
    
        return await connection.promise().query(sqlQuery, queryParams);
    }
    static async updateStatusByProjectID(status, projectID){
        const sqlQuery = "UPDATE Project SET Status = ? WHERE ProjectID=?";
        return await connection.promise().query(sqlQuery,[status, projectID]);
    }
    static async searchProjects(query){
        const sqlQuery = "SELECT * FROM Project WHERE ProjectName LIKE ?  ";
        return await connection.promise().query(sqlQuery, [`%${query}%`, `%${query}%`]);
    }
    static async searchProjectsLocation(query){
        const sqlQuery = "SELECT * FROM Project WHERE ProjectName LIKE ?  ";
        return await connection.promise().query(sqlQuery, [`%${query}%`, `%${query}%`]);
    }
    static async searchAllProjects(){
        const sqlQuery = "SELECT * FROM Project";
        return await connection.promise().query(sqlQuery);
    }
    static async getScopeWorkID(projectID){
        const sqlQuery = "SELECT WorkID as ID FROM ScopeWork WHERE ProjectID = ?";
        return await connection.promise().query(sqlQuery, [projectID]);
    }
    static async deleteProject(projectID){
        const sqlQuery = `DELETE FROM Project WHERE ProjectID = ?`;
        return await connection.promise().query(sqlQuery, [projectID]);
    }
};

module.exports = ProjectModel;
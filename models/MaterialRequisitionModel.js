const connection = require("../config/connection");

class MaterialRequisitionModel{
    // For creating requisition
    static async createRequisition(projectID, assignID){
        const sql = "INSERT INTO MaterialRequisition (ProjectID, AssignID, ReqStatus) VALUES (?, ?, ?)";
        return await connection.promise().query(sql,[projectID, assignID,0]);
    }
    // to fetch all requisitions under one project
    static async fetchByProject(projectID){
        const sql = "SELECT * FROM MaterialRequisition WHERE ProjectID = ?";
        return await connection.promise().query(sql, [projectID]);
    }
    // To collect all relevant information after choosing a MR
    static async fetchByMRID(MR_ID){
        const sql = "SELECT * FROM MaterialRequisition WHERE MaterialRequisitionID = ?";
        return await connection.promise().query(sql, [MR_ID]);
    }
    // If an user wants to check which requisition he has requested under a project
    static async fetchByProject_AssignEngineerID(projectID, assignID){
        const sql = "SELECT * FROM MaterialRequisition WHERE ProjectID = ? AND AssignID = ?";
        return await connection.promise().query(sql, [projectID, assignID]);
    }
    // To check the pending status, inside the pending status page
    static async fetchByProjectID_Status(projectID, status){
        const sql = "SELECT * FROM MaterialRequisition WHERE ProjectID = ? AND ReqStatus = ?";
        return await connection.promise().query(sql, [projectID, status]);
    }
    // Fetched MR_IDs based on Project
    static async fetchMRIDByProject(projectID){
        const sql = "SELECT MaterialRequisitionID AS MRID FROM MaterialRequisition WHERE ProjectID = ?";
        return await connection.promise().query(sql, [projectID]);
    }
    // Update requisition status and remarks
    static async updateRequisitionStatusAndRemarks(MR_ID, status) {
        const sql = "UPDATE MaterialRequisition SET ReqStatus = ? WHERE MaterialRequisitionID = ?";
        return await connection.promise().query(sql, [status, MR_ID]);
    }
    
    // Needed to safely delete MR(usersID) - > users chronologically
    static async getMR_assignedID(assignID){
        const sql = `SELECT MaterialRequisitionID FROM MaterialRequisition WHERE AssignID = ?`;
        return await connection.promise().query(sql, [assignID]);
    }
    static async deleteMR_assignedID(assignID){
        const sql = `DELETE FROM MaterialRequisition WHERE AssignID = ?`;
        return await connection.promise().query(sql, [assignID]);
    }

    static async deleteMR_MRID(MaterialRequisitionID){
        const sqlQuery = 'DELETE FROM MaterialRequisition WHERE MaterialRequisitionID = ?'
        return await connection.promise().query(sqlQuery, [MaterialRequisitionID]);
    };

    static async deleteMR_ProjectID(ProjectID){
        const sqlQuery = 'DELETE FROM MaterialRequisition WHERE ProjectID = ?'
        return await connection.promise().query(sqlQuery, [ProjectID]);
    }
};

module.exports = MaterialRequisitionModel;
const connection = require('../config/connection');

class AssignWorkerModel{
    static async assignWorker(workerID, contractorID, projectID){
        const sqlQuery = 'INSERT INTO assignedworker (worker_id, contractor_id, project_id) VALUES (?, ?, ?)';
        return await connection.promise().query(sqlQuery,[workerID, contractorID, projectID])
    };

    static async isWorkerAssigned(workerID, projectID){
        const sqlQuery = 'SELECT assignedworker_id FROM assignedworker WHERE worker_id = ? AND project_id = ?';
        return await connection.promise().query(sqlQuery, [workerID, projectID]);
    };

    static async getAssignedWorkers(projectID){
        const sqlQuery = 'SELECT worker_id FROM assignedworker WHERE project_id = ?';
        return await connection.promise().query(sqlQuery, [projectID]); 
    }

    static async getWorkerNotAssigned(projectID){
        const sqlQuery = "SELECT w.* FROM worker w LEFT JOIN assignedworker aw ON w.worker_id = aw.worker_id AND aw.project_id = ? WHERE aw.assignedworker_id IS NULL";
        return await connection.promise().query(sqlQuery, [projectID]);
    };

    static async getContractor_PID(projectID){
        const sqlQuery = 'SELECT contractor_id FROM assignedworker WHERE project_id = ?';
        return await connection.promise().query(sqlQuery, [projectID]);
    };

    static async getWorkerID_AID(assignedworkerID){
        const sqlQuery = `SELECT worker_id FROM assignedworker WHERE assignedworker_id = ?`;
        return await connection.promise().query(sqlQuery, [assignedworkerID]);
    };

    static async getRatingList(workerID){
        const sqlQuery = `SELECT rating FROM assignedworker WHERE worker_id = ?`;
        return await connection.promise().query(sqlQuery, [workerID])
    };

    static async updateRating(rating, assignedworkerID,projectID) {
        console.log(rating,assignedworkerID,projectID);
        const sqlQuery = `UPDATE assignedworker SET rating = ? WHERE worker_id = ? and project_id = ?`;
        // console.log(sqlQuery);
        return await connection.promise().query(sqlQuery, [rating, assignedworkerID,projectID]);
    };

    static async deleteAssiged_WID(workerID){
        const sqlQuery = 'DELETE FROM assignedworker WHERE worker_id = ?';
        return await connection.promise().query(sqlQuery, [workerID]);
    };
    
    static async deleteAssiged_ID(assignedworkerID,projectID){
        const sqlQuery = 'DELETE FROM assignedworker WHERE worker_id = ? and project_id = ?';
        return await connection.promise().query(sqlQuery, [assignedworkerID,projectID]);
    };

    static async deleteAssiged_ID(projectID){
        const sqlQuery = 'DELETE FROM assignedworker WHERE project_id = ?';
        return await connection.promise().query(sqlQuery, [projectID]);
    };
};

module.exports = AssignWorkerModel;
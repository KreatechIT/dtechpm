const connection = require('../config/connection');

class WorkerModel{
    static async createWorker(ContractorID, name, contact, address, bloodGroup){
        const sqlQuery = `INSERT INTO worker (contractor_id, name, contact, address, bloodgroup, rating) VALUES (?, ?, ?, ?, ?, 0)`;
        return await connection.promise().query(sqlQuery, [ContractorID, name, contact, address, bloodGroup]);
    };

    static async getWorkerAll(){
        const sqlQuery = `SELECT * FROM worker`
        return await connection.promise().query(sqlQuery);
    };

    static async getWorker_CID(ContractorID){
        const sqlQuery = `SELECT * FROM worker WHERE contractor_id = ?`;
        return await connection.promise().query(sqlQuery, [ContractorID]);
    };

    static async getWorker(workerID){
        const sqlQuery = `SELECT * FROM worker WHERE worker_id = ?`;
        return await connection.promise().query(sqlQuery, [workerID]);
    }

    static async updateWorker(workerID, name, contact, address, bloodGroup) {
        const sqlQuery = `
            UPDATE worker
            SET name = ?, contact = ?, address = ?, bloodgroup = ?
            WHERE worker_id = ?`;
        return await connection.promise().query(sqlQuery, [name, contact, address, bloodGroup, workerID]);
    };
    
    static async updateTotalRating (workerID, totalRating){
        const sqlQuery = `UPDATE worker SET rating = ? WHERE worker_id = ?`;
        return await connection.promise().query(sqlQuery, [totalRating, workerID])
    };

    static async deleteWorker(workerID){
        const sqlQuery = 'DELETE FROM worker WHERE worker_id = ?';
        return await connection.promise().query(sqlQuery, [workerID]);
    };

    static async deleteWorker_CID(contractor_id){
        const sqlQuery = 'DELETE FROM worker WHERE contractor_id = ?';
        return await connection.promise().query(sqlQuery, [contractor_id]);
    }

}

module.exports = WorkerModel;
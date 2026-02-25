const connection = require('../config/connection');

class ContractorModel{
    static async createContractor(name, contact, address, BGroup){
        const sqlQuery = `INSERT INTO contractor (name, contact, address, bloodgroup) VALUES (?, ?, ?, ?)`;
        return await connection.promise().query(sqlQuery, [name, contact, address, BGroup]);
    };
    static async getContractorAll(){
        const sqlQuery = `SELECT * FROM contractor`;
        return await connection.promise().query(sqlQuery);
    };
    static async getContractorName(C_ID){
        const sqlQuery= `SELECT name FROM contractor WHERE contractor_id = ?`;
        return await connection.promise().query(sqlQuery, [C_ID]);
    };
    static async getContractorByID(C_ID){
        const sqlQuery= `SELECT * FROM contractor WHERE contractor_id = ?`;
        return await connection.promise().query(sqlQuery, [C_ID]); 
    }
    static async updateContractor(C_ID, name, contact, address, BGroup){
        const sqlQuery = `UPDATE contractor 
        SET 
            name = ?,
            contact = ?,
            address = ?,
            bloodgroup = ?
        WHERE
            contractor_id = ?`;
        return await connection.promise().query(sqlQuery, [name, contact, address, BGroup, C_ID]);
    };
    static async deleteContractor(contractorID){
        const sqlQuery = 'DELETE FROM contractor WHERE contractor_id = ?';
        return await connection.promise().query(sqlQuery, [contractorID]);
    }
};

module.exports = ContractorModel;
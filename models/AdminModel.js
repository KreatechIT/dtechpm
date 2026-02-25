const connection = require('../config/connection');

class AdminModel{
    static async checkEmailExists(email){
        const adminChecker = "SELECT * FROM Admin WHERE Email = ?";
        return await connection.promise().query(adminChecker, email);
    }
    static async insertAdmin(name, email, hash){
        const sql = "INSERT INTO Admin (Name, Email, Password) VALUES (?, ?, ?)";
        return await connection.promise().query(sql, [name, email, hash]);
    }
    static async fetchEmailbyID (AdminID){
        const query = "SELECT Email FROM Admin WHERE AdminID = ?";
        return await connection.promise().query(query, AdminID);
    }
    static async updateInfo(name, email, picture, adminID) {
        const sql = "UPDATE Admin SET Name = ?, Email = ?, Picture = ? WHERE AdminID = ?";
        return await connection.promise().query(sql, [name, email, picture, adminID]);
    }
    static async updatePassword (password, adminID){
        const sql = "UPDATE Admin SET Password = ? WHERE AdminID = ?";
        return await connection.promise().query(sql, [password, adminID]);
    }
    static async fetchAccount (AdminID){
        const sql = "SELECT * FROM Admin WHERE AdminID = ?";
        return await connection.promise().query(sql, [AdminID]);
    }
}

module.exports = AdminModel;
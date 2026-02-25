const connection = require('../config/connection');

class QCModel{
    static async createQCReport(RequestedItemID, ReportDate, ReportMonth, ReportYear, Remarks, AmountGood, Thickness, size, Quality){
        const sqlQuery = `INSERT INTO QualityControlReport 
        (RequestedItemID, ReportDate, ReportMonth, ReportYear, Remarks, AmountGood, Thickness, SIZE, Quality, ApprovalStatus) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`;
        return await connection.promise().query(sqlQuery,[RequestedItemID, ReportDate, ReportMonth, ReportYear, Remarks, AmountGood, Thickness, size, Quality]);
    };
    static async fetchQCReportbyReqID(RequestedItemID){
        const sqlQuery = `SELECT * FROM QualityControlReport WHERE RequestedItemID = ?`;
        return await connection.promise().query(sqlQuery, [RequestedItemID]);
    };
    static async fetchQCReportbyID(QualityControlReportID){
        const sqlQuery = `SELECT * FROM QualityControlReport WHERE QualityControlReportID = ?`;
        return await connection.promise().query(sqlQuery, [QualityControlReportID]);
    };
    static async fetchQCReportByStatus(RequestedItemID, ApprovalStatus){
        const sqlQuery = `SELECT * FROM QualityControlReport WHERE RequestedItemID = ? AND ApprovalStatus = ?`;
        return await connection.promise().query(sqlQuery,[RequestedItemID, ApprovalStatus]);
    }
    static async updateQCReportByID( ReportDate,
        ReportMonth,
        ReportYear,
        Remarks,
        AmountGood,
        Thickness,
        SIZE,
        Quality,QualityControlReportID){
        const updateQCReportQuery = `
        UPDATE QualityControlReport
        SET
            ReportDate = ?,
            ReportMonth = ?,
            ReportYear = ?,
            Remarks = ?,
            AmountGood = ?,
            Thickness = ?,
            SIZE = ?,
            Quality = ?
        WHERE QualityControlReportID = ?
        `;
        return await connection.promise().query(updateQCReportQuery, [ ReportDate,
            ReportMonth,
            ReportYear,
            Remarks,
            AmountGood,
            Thickness,
            SIZE,
            Quality,QualityControlReportID]);
    };
    static async deleteQCReport(RequestedItemID){
        const sqlQuery = `DELETE FROM QualityControlReport
        WHERE RequestedItemID = ?`;
        return await connection.promise().query(sqlQuery, [RequestedItemID]);
    };
    static async updateStatusApproval(QualityControlReportID, ApprovalStatus){
        const sqlQuery = `
        UPDATE QualityControlReport
        SET 
            ApprovalStatus = ?
        WHERE
        QualityControlReportID = ?`;
        return await connection.promise().query(sqlQuery, [ApprovalStatus, QualityControlReportID]);
    };
    static async fetchQCReport_Status_QCID(QualityControlReportID){
        const sqlQuery = `SELECT ApprovalStatus FROM QualityControlReport 
        WHERE 
            QualityControlReportID = ?`;
        return await connection.promise().query(sqlQuery, [QualityControlReportID]);
    }
};

module.exports = QCModel;
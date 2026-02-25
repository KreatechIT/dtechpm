const QCModel = require('../models/QCModel');
const RequestedItemModel = require('../models/RequestedItemModel');

function validateExpectedDate(expectedDate){
    validateDate = /^\d{4}-\d{2}-\d{2}$/;

    if (!validateDate.test(expectedDate))
        return false;

    else return true;
};

exports.createQCReport = async (req, res) => {
    const { RequestedItemID, ReportDate, Remarks, AmountGood, Thickness, Size, Quality } = req.body;

    if (!validateExpectedDate(ReportDate)){
        return res.status(400).json({
            message: `Bad Request: Expected Date format incorrect.\nFormat: YYYY-MM-DD`
        });
    };

    const getDateObj = new Date(ReportDate);
    const ReportMonth = getDateObj.toLocaleString('default', {month:'long'});
    const ReportYear = getDateObj.getFullYear();
    try {
        const [isQCExist] = await QCModel.fetchQCReportbyReqID(RequestedItemID);

        if (isQCExist.length > 0) 
        return res.status(404).json({
            message:`QC with Request Item ID: ${RequestedItemID} exists`,
            data: isQCExist
        });

        const createReportResult = await QCModel.createQCReport(
            RequestedItemID,
            ReportDate,
            ReportMonth,
            ReportYear,
            Remarks,
            AmountGood,
            Thickness,
            Size,
            Quality
        );
        const createdReportID = createReportResult[0].insertId;

        return res.status(201).json({
            message: 'Quality Control Report created successfully',
            createdReportID: createdReportID,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', error });
    }
};
exports.fetchQCReportByReqID = async (req, res) => {
    const { RequestedItemID } = req.params;

    try {
        if (isNaN(RequestedItemID)) {
            return res.status(400).json({
                message: 'Bad Request: Invalid RequestedItemID',
                RequestedItemID: RequestedItemID,
            });
        }

        const [qcReports, fields] = await QCModel.fetchQCReportbyReqID(RequestedItemID);

        if (qcReports.length === 0) {
            return res.status(404).json({
                message: 'No Quality Control Report found for the specified RequestedItemID',
            });
        }

        return res.status(200).json({
            message: 'Quality Control Reports fetched successfully',
            qcReports: qcReports,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', error });
    }
};
exports.fetchQCReportByMRID = async (req, res) => {
    const { MaterialRequisitionID } = req.params;
    try {
        if (isNaN(MaterialRequisitionID)) {
            return res.status(400).json({
                message: 'Bad Request: Invalid RequestedItemID',
                MaterialRequisitionID: MaterialRequisitionID,
            });
        };

        const [requestedItemIDArr] = await RequestedItemModel.fetchRequestIDByMRID(MaterialRequisitionID);

        let qcReportArr = [];

        for (const iterator of requestedItemIDArr) {
            const reqItemID = iterator.RequestedItemID;
            const [data] = await QCModel.fetchQCReportbyReqID(reqItemID);
            // console.log(data);
            qcReportArr.push(data);
        }

        const filteredResult = qcReportArr.filter(item => item !== undefined);

        if (filteredResult.length === 0) return res.status(404).json({
            message:'No QC Report found'
        })

        return res.status(200).json({
            filteredResult
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', error });
    }
}

exports.fetchQCReportByID = async (req, res) => {
    const { QualityControlReportID } = req.params;

    try {
        if (isNaN(QualityControlReportID)) {
            return res.status(400).json({
                message: 'Bad Request: Invalid QualityControlReportID',
                QualityControlReportID: QualityControlReportID,
            });
        }

        const [qcReport, fields] = await QCModel.fetchQCReportbyID(QualityControlReportID);

        if (!qcReport || qcReport.length === 0) {
            return res.status(404).json({
                message: 'No Quality Control Report found for the specified QualityControlReportID',
            });
        }

        return res.status(200).json({
            message: 'Quality Control Report fetched successfully',
            qcReport: qcReport[0],
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', error });
    }
};

exports.fetchQCReportByStatus = async (req, res) => {
    const { MaterialRequisitionID } = req.params;
    const {ApprovalStatus} = req.body;

    try {
        if (isNaN(MaterialRequisitionID)) {
            return res.status(400).json({
                message: 'Bad Request: Invalid RequestedItemID',
                MaterialRequisitionID: MaterialRequisitionID,
            });
        };

        const [requestedItemIDArr] = await RequestedItemModel.fetchRequestIDByMRID(MaterialRequisitionID);

        let qcReportArr = [];

        for (const iterator of requestedItemIDArr) {
            const reqItemID = iterator.RequestedItemID;
            const [data] = await QCModel.fetchQCReportByStatus(reqItemID, ApprovalStatus);
            qcReportArr.push(data[0]);
        }

        const filteredResult = qcReportArr.filter(item => item !== undefined);

        if (filteredResult.length === 0) return res.status(404).json({
            message:'No QC Report found'
        })

        return res.status(200).json({
            filteredResult
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', error });
    }
};
exports.updateQCReportByID = async (req, res) => {
    const { QualityControlReportID } = req.params;
    const { ReportDate, Remarks, AmountGood, Thickness, SIZE, Quality } = req.body;

    try {
        if (isNaN(QualityControlReportID)) {
            return res.status(400).json({
                message: 'Bad Request: Invalid QualityControlReportID',
                QualityControlReportID: QualityControlReportID,
            });
        }

        if (!validateExpectedDate(ReportDate)){
            return res.status(400).json({
                message: `Bad Request: Expected Date format incorrect.\nFormat: YYYY-MM-DD`
            });
        };
    
        const getDateObj = new Date(ReportDate);
        const ReportMonth = getDateObj.toLocaleString('default', {month:'long'});
        const ReportYear = getDateObj.getFullYear();

        const [updateResult] = await QCModel.updateQCReportByID(
            ReportDate,
            ReportMonth,
            ReportYear,
            Remarks,
            AmountGood,
            Thickness,
            SIZE,
            Quality,
            QualityControlReportID,
            );

        if (updateResult.changedRows === 0) {
            if (updateResult.affectedRows === 0) {
                return res.status(404).json({
                    message: 'No Quality Control Report found for the specified QualityControlReportID',
                });
            }
            return res.status(304).json({
                message: 'Not Modified',
            });
        }

        return res.status(200).json({
            message: `Quality Control Report with ID ${QualityControlReportID} updated successfully`,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', error });
    }
};
exports.deleteQcReportByReqID = async (req, res) => {
    const { RequestedItemID } = req.params;

    try {
        if (isNaN(RequestedItemID)) {
            return res.status(400).json({
                message: 'Bad Request: Invalid RequestedItemID',
                RequestedItemID: RequestedItemID,
            });
        }

        const [result] = await QCModel.deleteQCReport(RequestedItemID);
        if (result[0].affectedRows < 1)
        return res.status(404).json({
            message:`404: No Requested Items found`
        })

        return res.status(200).json({
            message:`Successfull: Item Deleted`
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', error });
    }
};
exports.updateStatusApproval = async (req, res) => {
    try {
        const {QualityControlReportID} = req.params;
        const { ApprovalStatus } = req.body;

        if (isNaN(QualityControlReportID) || isNaN(ApprovalStatus)) {
            return res.status(400).json({ error: 'Missing required parameters.' });
        }

        const [updateResult] = await QCModel.updateStatusApproval(QualityControlReportID, ApprovalStatus);

        if (updateResult.changedRows === 0) {
            if (updateResult.affectedRows === 0) {
                return res.status(404).json({
                    message: 'No Quality Control Report found for the specified QualityControlReportID',
                });
            }
            return res.status(304).json({
                message: 'Not Modified',
            });
        }

        return res.status(200).json({ success: true, message: 'Status updated successfully.' });
    } catch (error) {
        console.error('Error updating status:', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
};

exports.fetchQCReport_Status_QCID = async (req, res) => {
    try {
        const {QualityControlReportID} = req.params;

        if (isNaN(QualityControlReportID)) {
            return res.status(400).json({ error: 'Missing required parameters.' });
        }

        const [result] = await QCModel.fetchQCReport_Status_QCID(QualityControlReportID);

        if (result.length === 0) {
            return res.status(404).json({ error: 'No matching records found.' });
        }
        return res.status(200).json({ data: result });
    } catch (error) {
        console.error('Error fetching QC report:', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
};
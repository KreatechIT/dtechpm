const MaterialRequisitionModel = require('../models/MaterialRequisitionModel');
const RequestedItemModel = require('../models/RequestedItemModel');
const ArrivalStatusModel = require('../models/ArrivalStatusModel');


function validateExpectedDate(expectedDate){
    validateDate = /^\d{4}-\d{2}-\d{2}$/;
    // /^\d{4}-\d{2}-\d{2}$/; 

    if (!validateDate.test(expectedDate))
        return false;
    
    else return true
};

exports.createArrivalStatus = async (req, res) => {
    const {RequestedItemID,
        AmountReceived,
        AmountGood,
        ReceivedDate} = req.body;

    if (isNaN(RequestedItemID)){
        return res.status(400).json({
            message:`Bad Request: Missing Required Fields`,
            RequestedItemID: RequestedItemID, TypeMR: typeof(RequestedItemID)
        });
    };

    if (!validateExpectedDate(ReceivedDate)){
        return res.status(400).json({
            message: `Bad Request: Expected Date format incorrect.\nFormat: YYYY-MM-DD`
        });
    };

    const getDateObj = new Date(ReceivedDate);
    const ReceivedMonth = getDateObj.toLocaleString('default', {month:'long'});
    const ReceivedYear = getDateObj.getFullYear();

    try{
        const [isArrivalStatusExist] = await ArrivalStatusModel.fetchArrivalStatusByReqID(RequestedItemID);

        console.log(isArrivalStatusExist);
        if (isArrivalStatusExist.length > 0)
            return res.status(409).json({
                message:`Conflict: Arrival Status with RequestID ${RequestedItemID} exists`
            });

        await ArrivalStatusModel.createArrivalStatus(RequestedItemID,
            AmountReceived,
            AmountGood,
            ReceivedDate,
            ReceivedMonth,
            ReceivedYear);

        return res.status(201).json({
            message:`Arrival information created successfully`
        });
    } catch (error){
        console.error(error);
        return res.status(500).json(error)
    }

};

exports.fetchByMRID = async (req, res) => {
    const {MaterialRequisitionID} = req.params;

    if (isNaN(MaterialRequisitionID)){
        return res.status(400).json({
            message:`Bad Request: Missing Required Fields`,
            MaterialRequisitionID: MaterialRequisitionID, TypeMR: typeof(MaterialRequisitionID)
        });
    };
    try{
        const [fetchedData] = await MaterialRequisitionModel.fetchByMRID(MaterialRequisitionID);

        if (fetchedData.length === 0){
            return res.status(404).json({
                message: `404: No Requisition found`
            });
        };

        const [requestedIDArr] = await RequestedItemModel.fetchRequestIDByMRID(MaterialRequisitionID);

        let arrivedItemArr = [];

        for (const iterator of requestedIDArr) {
            const [data] = await ArrivalStatusModel.fetchArrivalStatusByReqID(iterator.RequestedItemID);
            arrivedItemArr.push(data[0]);
        }

        if (arrivedItemArr.length === 0)
            return res.status(404).json({
                message: `No Arrival Statuses found`
            })
        
        return res.status(201).json({
            arrivedItemArr
        });
    } catch (error){
        console.error(error);
        return res.status(500).json(error);
    };
};

exports.updateArrivalStatusByReq = async (req, res) => {
    const {RequestedItemID} = req.params;
    const {AmountReceived, ReceivedDate} = req.body;

    if (isNaN(RequestedItemID)){
        return res.status(400).json({
            message:`Bad Request: Missing Required Fields`,
            RequestedItemID: RequestedItemID, TypeMR: typeof(RequestedItemID)
        });
    };

    if (!validateExpectedDate(ReceivedDate)){
        return res.status(400).json({
            message: `Bad Request: Expected Date format incorrect.\nFormat: YYYY-MM-DD`
        });
    };

    const getDateObj = new Date(ReceivedDate);
    const ReceivedMonth = getDateObj.toLocaleString('default', {month:'long'});
    const ReceivedYear = getDateObj.getFullYear();

    try{
        const [updateResult] = await ArrivalStatusModel.updateArrivalStatusByReqID(AmountReceived, ReceivedDate, ReceivedMonth, ReceivedYear, RequestedItemID);
        if (updateResult.changedRows === 0){
            if (updateResult.affectedRows === 0){
                return res.status(404).json({
                    message:`404: No Rows Matched`,
                    Info: updateResult.Info
                });
            }
            return res.status(304).json({
                message: 'Not Modified'
            });
        }
        return res.status(200).json({
            message: `Successful: ${updateResult.info}`
        });
    } catch (error){
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', error });
    };
};
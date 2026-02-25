const WorkerModel = require('../models/WorkerModel');
const ContractorModel = require('../models/ContractorModel');
const AssignWorkerModel = require('../models/AssignWorkerModel');

const Joi = require('joi');

const schemaCreate = Joi.object({
    ContractorID: Joi.number().required(),
    name: Joi.string().required(),
    contact: Joi.string().required(),
    address: Joi.string().required(),
    bloodGroup: Joi.string().required()
});

const schemaWorkerID = Joi.object({
    workerID: Joi.number().required()
});

const schemaContractorID = Joi.object({
    ContractorID: Joi.number().required()
})

exports.createWorker = async (req, res) => {

    const { error, value } = schemaCreate.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: 'BAD REQUEST: INVALID DATA',
            error: error.details[0].message
        });
    }

    const { ContractorID, name, contact, address, bloodGroup } = value;

    try{
        await WorkerModel.createWorker(ContractorID, name, contact, address, bloodGroup);
        return res.status(201).json({
            message:'SUCCESSFUL'
        });
    } catch (error){
        return res.status(500).json({
            message:'INTERNAL SERVER ERROR',
            error: error
        });
    }
};

exports.getWorker_WID = async (req, res) => {
    const {error, value} = schemaWorkerID.validate(req.params);

    if (error){
        return res.status(400).json({
            message: 'BAD REQUEST: INVALID DATA',
            error: error.details[0].message
        });
    };

    const {workerID} = value;

    const [result] = await WorkerModel.getWorker(workerID);

    if (result.length === 0){
        return res.status(404).json({
            message: `No worker found`
        })
    }

    const workerInfo = result[0];
    return res.status(201).json({
        workerInfo
    })
}


exports.getWorkerAll = async (req, res) => {
    try{
        const [result] = await WorkerModel.getWorkerAll();

        let resultArr = [];

        for (const iterator of result) {
            const [contractorName] = await ContractorModel.getContractorName(iterator.contractor_id);

            iterator.nameContractor = contractorName[0].name;

            resultArr.push(iterator);
        }

        return res.status(201).json({
            resultArr
        })
    } catch (error){
        return res.status(500).json({
            message:'INTERNAL SERVER ERROR',
            error: error
        });
    }
};

exports.getWorkersByCID = async (req, res) => {
    const {error, value} = schemaContractorID.validate(req.params);

    if (error) {
        return res.status(400).json({
            message: 'BAD REQUEST: INVALID DATA',
            error: error.details[0].message
        });
    };

    const {ContractorID} = value;

    try{
        const [isContractorExist] = await ContractorModel.getContractorByID(ContractorID);

        if (isContractorExist < 1){
            return res.status(404).json({
                message:'No Contractor Found'
            });
        }

        const [result] = await WorkerModel.getWorker_CID(ContractorID);

        if (result.length < 1){
            return res.status(404).json({
                message:'No Worker Found'
            })
        }

        return res.status(201).json({
            result
        });

    } catch (error){
        return res.status(500).json({
            message:'INTERNAL SERVER ERROR',
            error: error
        });
    }
};

exports.updateWorker = async (req, res) => {
    const {error, value} = schemaWorkerID.validate(req.params);

    if (error){
        return res.status(400).json({
            message: 'BAD REQUEST: INVALID DATA',
            error: error.details[0].message
        });
    };

    const {workerID} = value;

    const {name, contact, address, bloodGroup} = req.body;

    try{
        const [result] = await WorkerModel.updateWorker(workerID, name, contact, address, bloodGroup);
        
        if (result.changedRows < 1) {
            if (result.affectedRows < 1)
                return res.status(404).json({
                    message: `404: No Rows Matched`,
                    Info: result.Info
                });
            return res.status(201).json({
                info: result.info
            });
        }

        return res.status(200).json({
            message: `Successful: ${result.info}`
        });
    } catch (error) {
        return res.status(500).json({
            message:'INTERNAL SERVER ERROR',
            error: error
        });
    }
};

exports.deleteWorker_WID = async (req, res) => {
    const {error, value} = Joi.object({
        workerID: schemaWorkerID.extract('workerID')
    }).validate(req.params);

    if (error){
        return res.status(400).json({
            message: 'BAD REQUEST: INVALID DATA',
            error: error.details[0].message
        });
    }

    try{
        const {workerID} = value;

        const [isWorkerExist] = await WorkerModel.getWorker(workerID);

        if (isWorkerExist.length === 0){
            return res.status(404).json({
                message: `Worker with ID ${workerID} does not exist`
            });
        }

        const [assignedWorkerDeleteResult] = await AssignWorkerModel.deleteAssiged_WID(workerID);
        // console.log(assignedWorkerDeleteResult);
    
        const [workerDeleteResult] = await WorkerModel.deleteWorker(workerID);
    
        console.log(workerDeleteResult)
        if (workerDeleteResult.affectedRows === 0){
            return res.status(304).json({
                message:'No modification'
            })
        }
    
        return res.status(200).json({
            message: 'SUCCESS',
            WorkerTable_AffectedRows: workerDeleteResult.affectedRows,
            AssignedTable_AffectedRows: assignedWorkerDeleteResult.affectedRows
        });
    } catch (error) {
        return res.status(500).json({
            message:'INTERNAL SERVER ERROR',
            error: error
        });
    }
}
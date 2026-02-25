const AssignWorkerModel = require('../models/AssignWorkerModel');
const WorkerModel = require('../models/WorkerModel');
const ContractorModel = require('../models/ContractorModel');
const ProjectModel = require('../models/ProjectModel');

const Joi = require('joi');

const schemaCreation = Joi.object({
    workerID: Joi.number().required(),
    contractorID: Joi.number().required(),
    projectID: Joi.number().required()
});

exports.assignWorker = async (req, res) => {
    const {error, value} = schemaCreation.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: 'BAD REQUEST: INVALID DATA',
            error: error.details[0].message
        });
    };

    const {workerID, contractorID, projectID} = value;

    try{

        const [isWorkerAssigned] = await AssignWorkerModel.isWorkerAssigned(workerID, projectID);

        console.log(isWorkerAssigned);
        if (isWorkerAssigned.length > 0){
            return res.status(409).json({
                message: 'CONFLICT: Worker already in Project'
            });
        }

        await AssignWorkerModel.assignWorker(workerID, contractorID, projectID);
        return res.status(201).json({
            message:'SUCCESSFUL'
        })
    } catch(error) {
        return res.status(500).json({
            message:'INTERNAL SERVER ERROR',
            error: error
        });
    }
};

exports.getWorkerNotAssigned = async (req, res) => {
    const {projectID} = req.params;

    if (isNaN(projectID)){
        return res.status(400).json({
            message: 'BAD REQUEST: INVALID DATA',
            projectID: projectID,
            type: typeof(projectID)
        });
    };

    try{
        const [isProjectExist] = await ProjectModel.fetchProjectByID(projectID);

        if (isProjectExist.length < 1){
            return res.status(404).json({
                message:'Project not found'
            });
        };

        const [availableWorkers] = await AssignWorkerModel.getWorkerNotAssigned(projectID);

        let workersArr = [];

        for (const iterator of availableWorkers) {
            const [contractorName] = await ContractorModel.getContractorName(iterator.contractor_id);

            iterator.contractorName = contractorName[0].name;
            workersArr.push(iterator);
        }

        return res.status(201).json({
            workersArr
        })
    } catch (error){
        return res.status(500).json({
            message:'INTERNAL SERVER ERROR',
            error: error
        });
    }
};
exports.getContractorName_PID = async (req, res) => {
    const {projectID} = req.params;

    if (isNaN(projectID)){
        return res.status(401).json({
            message: 'BAD REQUEST: MISSING REQUIRED FIELD',
            typeof: typeof(projectID),
            projectID: projectID
        })
    }

    try{
        const [result] = await AssignWorkerModel.getContractor_PID(projectID);

        if (result.length === 0) {
            return res.status(404).json({
                message:`No Contractor Found for Project ID: ${projectID}`
            });
        };
    
        contractorID = result[0].contractor_id;
        const [contractorName] = await ContractorModel.getContractorName(contractorID);
    
        return res.status(201).json({
            Name: contractorName[0].name
        });

    } catch (error){
        return res.status(500).json({
            message:'INTERNAL SERVER ERROR',
            error: error
        });
    }
};

exports.getContractor_PID = async (req, res) => {
    const {projectID} = req.params;

    if (isNaN(projectID)){
        return res.status(401).json({
            message: 'BAD REQUEST: MISSING REQUIRED FIELD',
            typeof: typeof(projectID),
            projectID: projectID
        })
    }

    try{
        const [result] = await AssignWorkerModel.getContractor_PID(projectID);

        if (result.length === 0) {
            return res.status(404).json({
                message:`No Contractor Found for Project ID: ${projectID}`
            });
        };

        let contractorArr = []; 
        let seenContractorIDs = new Set();

        for (const iterator of result) {     
            const contractorID = iterator.contractor_id;
    
            if (!seenContractorIDs.has(contractorID)) {
                const [contractorInfo] = await ContractorModel.getContractorByID(contractorID);

                contractorArr.push(contractorInfo[0]);
                seenContractorIDs.add(contractorID); // Mark contractor ID as seen
            }
        }

        return res.status(201).json({
            Contractor: contractorArr
        })
    } catch (error){
        console.error(error);
        return res.status(500).json({
            message:'INTERNAL SERVER ERROR',
            error: error
        });
    }
};

exports.getAssignedWorkers = async (req, res) => {
    const {projectID} = req.params;

    if (isNaN(projectID)){
        return res.status(401).json({
            message: 'BAD REQUEST: MISSING REQUIRED FIELD',
            typeof: typeof(projectID),
            projectID: projectID
        })
    };

    try{
        const [assignedIDList] = await AssignWorkerModel.getAssignedWorkers(projectID);

        if (assignedIDList.length === 0){
            return res.status(404).json({
                message:`No Worker Found for Project ID: ${projectID}`
            });
        }

        let workerArr = [];

        for (const iterator of assignedIDList) {
            const workerID = iterator.worker_id;
            const [workerInfo] = await WorkerModel.getWorker(workerID);
            const [contractorName] = await ContractorModel.getContractorName(workerInfo[0].contractor_id);
            
            console.log(contractorName)

            workerInfo[0].contractor_name = contractorName[0].name

            workerArr.push(workerInfo[0]);
        }

        return res.status(201).json({
            Workers: workerArr
        });

    } catch (error) {
        return res.status(500).json({
            message:'INTERNAL SERVER ERROR',
            error: error
        });
    }
};

exports.updateRating = async (req, res) => {
    const {assignedWorkerID , projectID} = req.params;
    console.log(assignedWorkerID,projectID);
    if (isNaN(assignedWorkerID)||isNaN(projectID)){
        return res.status(401).json({
            message: 'BAD REQUEST: MISSING REQUIRED FIELD',
            typeof: typeof(assignedWorkerID),
            assignedWorkerID: assignedWorkerID,
            projectID:projectID
        })
    }; 

    const {rating} = req.body;

    if (Number.isNaN(rating)){
        return res.status(401).json({
            message: 'BAD REQUEST: MISSING REQUIRED FIELD',
            typeof: typeof(rating),
            rating: rating
        })
    };

    try{
        console.log(rating,assignedWorkerID,projectID);
        const [updateIndividualResult] = await AssignWorkerModel.updateRating(rating, assignedWorkerID,projectID);
        console.log(updateIndividualResult);
        if (updateIndividualResult.changedRows === 0){
            if (updateIndividualResult.affectedRows === 0){
                return res.status(404).json({
                    message:`404: No Rows Matched`,
                    Info: updateIndividualResult.Info
                });
            }
            // return res.status(304).json({
            //     message: 'Not Modified'
            // });
        };

        // const [workerInfo] = await AssignWorkerModel.getWorkerID_AID(assignedWorkerID);
        // const workerID = workerInfo[0].worker_id;

        const [ratingList] = await AssignWorkerModel.getRatingList(assignedWorkerID);

        let count = 0;
        let ratingSum = 0;

        for (const iterator of ratingList) {
            console.log(iterator);
            if (iterator.rating < 1){
                continue;
            }

            ratingSum += iterator.rating;
            count++;
        }

        const totalRating = ratingSum/count;
        console.log(totalRating);
        const [updateResult] = await WorkerModel.updateTotalRating(assignedWorkerID, totalRating);
        if (updateResult.changedRows === 0){
            if (updateResult.affectedRows === 0){
                return res.status(404).json({
                    message:`404: No Rows Matched`,
                    Info: updateResult.Info
                });
            }
            // return res.status(304).json({
            //     message: 'Not Modified'
            // });
        };

        return res.status(200).json({
            message: `Successful: ${updateResult.info}`
        });

    } catch (error){
        return res.status(500).json({
            message:'INTERNAL SERVER ERROR',
            error: error
        });
    }
};

exports.deleteAssigned_WID = async (req, res) => {
    const {error, value} = Joi.object({
        workerID: schemaCreation.extract('workerID')
    }).validate(req.params);

    if (error){
        return res.status(400).json({
            message: 'BAD REQUEST: INVALID DATA',
            error: error.details[0].message
        });
    }
    
    try{
        const {workerID} = value;
    
        const [result] = await AssignWorkerModel.deleteAssiged_WID(workerID);
        console.log(result);
    
        if (result.affectedRows === 0){
            return res.status(304).json({
                message:'No modification'
            })
        }
    
        return res.status(200).json({
            message: 'SUCCESS'
        });

    } catch (error){
        return res.status(500).json({
            message:'INTERNAL SERVER ERROR',
            error: error
        });
    }
};

exports.deleteWorkerByID = async (req, res) => {
    const {assignedWorkerID,projectID} = req.params;

    if (isNaN(assignedWorkerID)||isNaN(projectID)){
        return res.status(401).json({
            message: 'BAD REQUEST: MISSING REQUIRED FIELD',
            typeof: typeof(assignedWorkerID),
            assignedWorkerID: assignedWorkerID,
            projectID:projectID
        })
    };
    
    try{
    
        const [result] = await AssignWorkerModel.deleteAssiged_ID(assignedWorkerID,projectID);
    
        if (result.affectedRows === 0){
            return res.status(304).json({
                message:'No modification'
            })
        }
    
        return res.status(200).json({
            message: 'SUCCESS'
        });

    } catch (error){
        return res.status(500).json({
            message:'INTERNAL SERVER ERROR',
            error: error
        });
    }
}
const ProjectModel = require('../models/ProjectModel');
const AssignedEngineerModel = require('../models/AssignEngineerModel');
const AssignWorkerModel = require('../models/AssignWorkerModel');
const MaterialRequisitionModel = require('../models/MaterialRequisitionModel');
const RequestedItemModel = require('../models/RequestedItemModel');
const QCModel = require('../models/QCModel');
const ReportModel = require('../models/ReportModel');
const RequestModel = require('../models/RequestModel');
const connection = require('../config/connection');

function isValidDateFormat(dateString){
    const regex = /^\d{4}-\d{2}-\d{2}$/;    // checks the date format of YYYY-MM-DD

    return regex.test(dateString);
}
exports.createProject = async (req, res) => {
    const { name, details, startDate, endDate, location, status } = req.body;

    if (!name || !startDate || !endDate) 
        return res.status(400).json({
            message: 'Bad Request: Missing Required Fields', 
            Name: name || null, 
            startDate: startDate || null, 
            EndDate: endDate || null,
            status: status || null
        });

    if (!isValidDateFormat(startDate) || !isValidDateFormat(endDate))
        return res.status(400).json({
            message: 'Bad Request: Date format is not correct.',
            startDate: startDate,
            endDate: endDate
        });

    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    if (startDateObj > endDateObj) {
        return res.status(400).json({
            message: 'Bad Request: Start date cannot be after end date.',
            startDate: startDate,
            endDate: endDate
        });
    }

    let file;
    if (req.file) {
        
        file = req.file.filename;
        console.log(file); 
    } else {
        file = null;
        console.log(file); 
    }

    try {
        // Execute the query and capture the result
        const [result] = await ProjectModel.createProject(name, details, startDate, endDate, location, status, file);
        
        // Assuming 'result' contains 'insertId' which is the ID of the newly created project
        if (result && result.insertId) {
            // Optionally, fetch the saved project data using the 'insertId' if needed
            // For simplicity, returning the insertId and a success message
            return res.status(200).json({
                message: `Created: ${name} has been successfully registered`,
                projectId: result.insertId, // Return the ID of the newly created project
                savedData: { // This is just an example of what you might return
                    name,
                    details,
                    startDate,
                    endDate,
                    location,
                    status,
                    file
                }
            });
        } else {
            // Handle unexpected result format
            return res.status(500).json({ message: 'Unexpected result format after project creation.' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', error });
    }
};


exports.fetchProjectByID = async (req, res) => {
    const {projectID} = req.params;

    if (isNaN(projectID)) return res.status(400)
                        .json({
                            message:`Bad Request: ProjectID is ${projectID || null}`
                        });
    try{
        const [response] = await ProjectModel.fetchProjectByID(projectID);
        if (response.length === 0) return res.status(404)
            .json({
                message:'404: No Information found',
                Response: response
            })
        return res.status(200).json(response[0]);
    } catch (error){
        console.error(error);
        return res.status(500)
            .json({
                message:'Internal Server Error',
                error
            })
    }
};

exports.fetchProjectName = async (req, res) => {
    const {projectID} = req.params;

    if (isNaN(projectID)) 
        return res.status(400)
                    .json({
                        message:`Bad Request: ProjectID is ${projectID || null}`
                    });

    try{
        const [response] = await ProjectModel.fetchProjectName(projectID);
        if (response.length === 0) 
            return res.status(404)
                        .json({
                            message: "404: No Information Found",
                            Response: response
                        });
        return res.status(200).json(response[0].Name);
    } catch (error) {
        console.error(error);
        return res.status(500)
            .json({
                message:'Internal Server Error',
                error
            });
    };

};
exports.fetchAllProjectByStatus = async (req, res) => {
    const {status} = req.query;
    // console.log(status)
    if (isNaN(status) || status === undefined)
        return res.status(400).json({
            message:"Bad Request: Missing Required Field",
            status: status || null
        });

    try{
        const [result] = await ProjectModel.fetchAllProjectByStatus(status);

        if (result.length === 0) 
            return res.status(404).json({
                message:`404: No ${status} project found`
            });
        
        return res.status(200).json({
            result
        });
    } catch (error){
        return res.status(500).json({
            message: "Internal Server Error",
            error: error
        });
    }
};

exports.updateProjectDetails = async (req, res) => {
    const { projectID } = req.params;
    const { ProjectName, Details, Start_Date, End_Date, Location } = req.body;
    let file = null;

    // Check if a file is uploaded
    if (req.file) {
        file = req.file.filename;
    }

    if (isNaN(projectID)) {
        return res.status(400).json({
            message: `Bad Request: Required fields not correct datatype`,
            ProjectID: projectID || null,
        });
    }

    const startDateObj = new Date(Start_Date);
    const endDateObj = new Date(End_Date);

    if (startDateObj > endDateObj) {
        return res.status(400).json({
            message: 'Bad Request: Start date cannot be after end date.',
            startDate: Start_Date,
            endDate: End_Date
        });
    }

    try {
        const [result] = await ProjectModel.updateProjectByProjectID(ProjectName, Details, Start_Date, End_Date, Location, file, projectID);

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
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', error });
    }
};

exports.updateStatusByProjectID = async (req, res) => {
    const {projectID} = req.params;
    const {status} = req.body;

    if (isNaN(projectID) || isNaN(status)){
        return res.status(400).json({
            message:`Bad Request: Required fields not correct datatype`,
            ProjectID: projectID || null,
            Status: status || null
        });
    }

    const [result] = await ProjectModel.updateStatusByProjectID(status, projectID);
    console.log(result)
    if (result.changedRows < 1){
        if (result.affectedRows < 1)
            return res.status(404).json({
                message:`404: No Rows Matched`,
                Info: result.Info
            });
        return res.status(304).json({
            info: result.info
        });
    }

    return res.status(200).json({
        message: `Successful: ${result.info}`
    });
}

exports.searchProjects = async (req, res) => {
    const { query } = req.query; // Assume the search query is passed as a query string parameter

    if (!query) {
        return res.status(400).json({ message: "Bad Request: Missing search query." });
    }

    try {
        const [results] = await ProjectModel.searchProjects(query);
        if (results.length === 0) {
            return res.status(404).json({ message: "No projects found matching the search criteria." });
        }
        return res.status(200).json(results);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", error });
    }

    
};

exports.searchProjectsLocation = async (req, res) => {
    const { query } = req.query; // Assume the search query is passed as a query string parameter

    if (!query) {
        return res.status(400).json({ message: "Bad Request: Missing search query." });
    }

    try {
        const [results] = await ProjectModel.searchProjects(query);
        if (results.length === 0) {
            return res.status(404).json({ message: "No projects found matching the search criteria." });
        }
        return res.status(200).json(results);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", error });
    }

    
};

exports.fetchAllProjects = async (req, res) => {
    // const { query } = req.query; // Assume the search query is passed as a query string parameter

    // if (!query) {
    //     return res.status(400).json({ message: "Bad Request: Missing search query." });
    // }

    try {
        const [results] = await ProjectModel.searchAllProjects();
        if (results.length === 0) {
            return res.status(404).json({ message: "No projects found matching the search criteria." });
        }
        return res.status(200).json(results);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", error });
    }
};

async function deleteScopeWorkBranch(workId){
    const queries = [
        `DELETE FROM Work_Quality WHERE WorkID = ${workId};`,
        `DELETE FROM completeworkflow WHERE targetworkflow_id IN (SELECT targetworkflow_id FROM targetworkflow WHERE scope_work_id = ${workId});`,
        `DELETE FROM remaining WHERE scopeWorkID = ${workId};`,
        `DELETE FROM targetworkflow WHERE scope_work_id = ${workId};`,
        `DELETE FROM ScopeWork WHERE WorkID = ${workId};`
      ];
    
      try {
        for (const query of queries) {
          await new Promise((resolve, reject) => {
            connection.query(query, (err, result) => {
              if (err) {
                console.error('Error executing query: ' + err);
                reject(err);
                return;
              }
              resolve();
            });
          });
        }
    
      } catch (error) {
        console.error('Error executing queries: ' + error);
        throw error;
    }
}

exports.deleteProject = async (req, res) => {
    const {projectID} = req.params;

    try {
        const [project] = await ProjectModel.fetchProjectName(projectID);
        if (project.length === 0)
            return res.status(404).json({
                message:`404: Project with ID ${projectID} doesn't exist`
            });
        const projectName = project[0].Name;


        const [workIDList] = await ProjectModel.getScopeWorkID(projectID);

        const IDs = workIDList.map(ID => ID.ID);

        for (const ID of IDs) {
            await deleteScopeWorkBranch(ID);
        }

        const [MaterialRequisitionID_List] = await MaterialRequisitionModel.fetchMRIDByProject(projectID)

        const MRIDs = MaterialRequisitionID_List.map(obj => obj.MRID);
        console.log(MRIDs);

        for (const ID of MRIDs) {
            const [requestedIDArr] = await RequestedItemModel.fetchRequestIDByMRID(ID);

            for (const iterator of requestedIDArr) {
                const reqItemID = iterator.RequestedItemID;
                console.log(reqItemID);
                await QCModel.deleteQCReport(reqItemID);
            }
            await RequestedItemModel.deleteRequestItem_MRID(ID);
        }
        await MaterialRequisitionModel.deleteMR_ProjectID(projectID);

        await ReportModel.deleteReport_ProjectID(projectID);
        await RequestModel.deleteRequestByProjectID(projectID);

        await AssignedEngineerModel.deleteAllAssignedByProject(projectID);
        await AssignWorkerModel.deleteAssiged_ID(projectID);

        await ProjectModel.deleteProject(projectID);

        return res.status(200).json({
            message:`Successful: ${projectName} has been deleted.`
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", error });
    }
}
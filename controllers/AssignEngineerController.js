const AssignedEngineerModel = require('../models/AssignEngineerModel');
const userModel = require('../models/userModel');
const projectModel = require('../models/ProjectModel');

exports.registerEngineer = async (req, res) => {
    const {userID, projectID} = req.body;

    if (isNaN(userID) || isNaN(projectID)) 
        return res.status(400)
            .json({message:"Bad Request: Missing required fields", userID:userID || null, projectID: projectID || null});

                //Needs to update after project API is made:
                //Needs to check whether the project exists or not
                // if it does, take the project name for output references
    const [isProjectExist] = await projectModel.fetchProjectByID(projectID);

                // Checking all available users 
                // if inputing user is alreayd assigned, won't create another registration
    const [userNotInProject] = await AssignedEngineerModel.fetchAllNotUsersByProjectID(projectID);
    console.log('userNotInProject', userNotInProject);

    try{
        const result = await userModel.getUserById(userID)
            // .then((error)=>{
            //     if (error) return res.status(404).json({message:`404: User with ${userID} not found`, error: error});
            // })
        console.log(result[0].UserID);

        userExistsChecker = false;
        for (const user of userNotInProject) {
            console.log('user', user.UserID);
            if (user.UserID === result[0].UserID) {
                userExistsChecker = true;   //userID has met an available slot
                break;
            }
        }
        if (!userExistsChecker)  //userID has not met an available slot i.e already assigned
            return res.status(409).json({
                message:`${result[0].Name} already assigned in project ${isProjectExist[0].ProjectName}`
        })
        
        const userName = result[0].Name;

        await AssignedEngineerModel.assignEngineer(userID, projectID);
        return res.status(201).json({message: `Assigned Engineer: ${userName} on Project ${isProjectExist[0].ProjectName}`});
    } catch(errorUpdate){
        console.error(errorUpdate);

        return res.status(500).json({message:"Internal Server Error:", errorUpdate});
    }
};
exports.fetchAllAssignedEngineers = async (req, res) => {

    const [result] = await AssignedEngineerModel.fetchAllProjectID();
    if (result.length === 0) 
        return res.status(404)
                    .json({
                        message:'404: No data in AssignedEngineer table'
                    });
    // Further development after project API has been created [Completed]
    // call the project Name to put with the relevant array [Completed]
    // filter out same names, or put it in the same project's name [Completed]

    let arrAll = [];
    for (item of result){
        const [userID] = await AssignedEngineerModel.fetchEngineerByProject(item.Project_ID);

        const userPromises = userID.map(async (user) => {
            const [userData] = await userModel.getUserById(user.UserID);
            return userData.Name;
        })

        const users = await Promise.all(userPromises);

        const [projectName] = await projectModel.fetchProjectName(item.Project_ID);
        arrAll.push({ProjectName: projectName[0].Name, User: users});
    };
    
    return res.status(201).json(arrAll);
};

// fetches all engineers that can be added for the project
exports.fetchAvailableEngineersByProjectID = async (req, res) => {
    const {projectID} = req.params;

    if (isNaN(projectID)) 
        return res.status(400).json({
            message: `Bad Request: Project ID is ${projectID}, type: ${typeof(projectID)}`
        });

    const [isProjectExists] = await projectModel.fetchProjectByID(projectID);
    if (isProjectExists.length === 0)
        return res.status(404).json({
            message:`404: Project with ID ${projectID} does not exist`
        });

    const [availableUsers] = await AssignedEngineerModel.fetchAllNotUsersByProjectID(projectID);
    if (availableUsers.length === 0) return res.status(404).json({
        message:'404: No User is available'
    });

    try{
        const userArr = [];
        for (const user of availableUsers) {
            const [userName] = await userModel.getUserNameByID(user.UserID);
            userArr.push({Name: userName[0].Name, ID: user.UserID, Email: userName[0].Email});
        }
        return res.status(201).json(userArr);
    } catch (err){
        return res.status(500).json({
            message:`Internal Server: ${err}`
        });
    }
};

    // Inserting UserID will fetch all the projects being assigned
    // the format is [{Name: , ID: ,}, ...]
    //if no project exists => status 404
exports.fetchAllProjectsByUserID = async (req, res) => {
    const {userID} = req.params;

    if (isNaN(userID))
        return res.status(400).json({
            message:`Bad Request: UserID is ${userID}`,
        });

    const [user] = await userModel.getUserById(userID);
    const name = user.Name;

    const [projects] = await AssignedEngineerModel.fetchProjectByEngineer(userID);
    if (projects.length === 0) return res.status(404).json({
        message:`404: No project found assigned to ${name}`
    });

    let projectArr = [];
    for (const project of projects) {
        console.log('project', project)
        const [projectName] = await projectModel.fetchProjectName(project.Projects);

        projectArr.push({Name:projectName[0].Name, ID: project.Projects});
    }
    console.log(projectArr)

    return res.status(200).json(projectArr);
};

//fetches all the projects under one user
exports.fetchAllUserByProject = async (req, res) => {
    const {projectID} = req.params;

    if (isNaN(projectID))
        return res.status(400).json({
            message:`Bad Request: Missing Required Field. ProjectID is ${projectID}`
        });
    
    const [projectInfo] = await projectModel.fetchProjectName(projectID);
    const projectName = projectInfo[0].Name;

    const [users] = await AssignedEngineerModel.fetchEngineerByProject(projectID);
    if (users.length === 0)
        return res.status(404).json({
            message:`404: No User assigned for ${projectName}`
        });

    let projectArr = [];
    for (const user of users) {
        const tempUser = await userModel.getUserById(user.UserID);
        projectArr.push({UserID: tempUser[0].UserID, Name: tempUser[0].Name});
    };
    return res.send(projectArr);
};

exports.getAssignID_userIDProjectID = async (req, res) => {
    const {userID, projectID} = req.params;

    try {
        const [dataList] = await AssignedEngineerModel.fetchAssignID_UserIDProjectID(userID, projectID);

        const result = dataList.map(obj => obj.AssignID);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            message:`Internal Server: ${error}`
        });
    }
}

// fetches both assignedID and corresponding userID lists based on projectID
exports.fetchAssignedAndUserID_ProjectID = async (req, res) => {
    const {projectID} = req.params;

    try {
        const  [dataList] = await AssignedEngineerModel.fetchAssignAndUserID_ProjectID(projectID);

        let arrList = [];
        for (const iterator of dataList) {
            const AssignID = iterator.AssignID;
            const UserID = iterator.UserID;

            arrList.push({AssignID, UserID});
        }

        return res.status(200).json(arrList);
    } catch (error) {
        return res.status(500).json({
            message:`Internal Server: ${error}`
        });
    }
}

// To delete all assigns as the project get deleted.
// THIS HAS TO BE CALLED BEFORE DELETING THE PROJECT (FOREIGN KEY CONSTRAINT ERROR)
exports.deleteAllAssignedByProjectID = async (req, res) => {
    const {projectID} = req.params;

    if (isNaN(projectID))
        return res.status(400).json({
            message:`Bad Request: Missing Required Field. ProjectID is ${projectID}`
        });
    
    const [isProjectExist] = await projectModel.fetchProjectName(projectID);
    if (isProjectExist.length == 0)
        return res.status(404).json({
            message:`404: No project exists with ${projectID}`
        })
    
    const projectName = isProjectExist[0].Name;
    console.log(projectName);

    try{
        const result = await AssignedEngineerModel.deleteAllAssignedByProject(projectID);
        if (result[0].affectedRows < 1)
            return res.status(404).json({
                message:`404: ${projectName} does not have any engineers assigned`
            })

        return res.status(200).json({
            message:`Successfull: All assigned Engineers of ${projectName} deleted`
        });
    } catch (error){
        console.error(error);
        return res.status(500).json({
            message:`Internal Server Error`,
            Error: error
        });
    };
};

// To delete a specific assignedID based on UserID and ProjectID.
// does not require the project to be deleted

exports.deleteOneAssigned = async (req, res) => {
    const {userID, projectID} = req.params;

    if (isNaN(userID) || isNaN(projectID))
        return res.status(400).json({
            message:`Bad Request: Missing Required Fields.`,
            UserID: userID || null,
            projectID: projectID || null
        });
    
    const [project] = await projectModel.fetchProjectName(projectID);
    if (project.length === 0)
        return res.status(404).json({
            message:`404: Project with ID ${projectID} doesn't exist`
        });
    const projectName = project[0].Name;

    const user = await userModel.getUserById(userID);
    userName = user[0].Name;

    try{
        const result = await AssignedEngineerModel.deleteAssignEngineer(userID, projectID);

        //if no row exists with that userID + projectID
        // No rows will be affected by the DEL query
        // hence the checker w/ 404 status if true
        if (result[0].affectedRows < 1) return res.status(404).json({
            message:`404: ${userName} with ID ${userID} not assigned to ${projectName} with ID ${projectID}`
        })

        // if any row has been affected, status 200 is added as successful
        return res.status(200).json({
            message:`Successful: ${userName} has been deleted from ${projectName}`
        });
    } catch (error){
        console.error(error);
        return res.status(500).json({
            message:'Internal Server Error'
        });
    }
};
exports.deleteAllAssignedByUser = async (req, res) => {
    const {userID} = req.params;

    if (isNaN(userID))
        return res.status(400).json({
            message: `Bad Request: User ID is ${userID}, type ${typeof(userID)}`
        });

    const [user] = await userModel.getUserNameByID(userID);
    if (user.length === 0 )
        return res.status(404).json({
            message: `404: User with ID ${userID} not found`
        });
    
    const userName = user[0].Name;

    try{
        const result = await AssignedEngineerModel.deleteAllAssignedByUser(userID);
        if (result[0].affectedRows < 1) return res.status(404).json({
            message:`404: ${userName} with ID ${userID} was assigned to any project`
        });
        
        return res.status(200).json({
            message:`Successful: ${userName} has been deleted from AssignedEngineer table`
        });
    } catch (error){
        console.error(error);
        return res.status(500).json({
            message:'Internal Server Error'
        });
    }
}

exports.fetchUserIDName_AssignID = async (req, res) => {
    const { assignID } = req.params;

    try {
        const [dataList] = await AssignedEngineerModel.fetchUserIDName_AssignID(assignID);

        const Name = dataList[0].name;
        const UserID = dataList[0].UserID;

        return res.status(200).json({Name, UserID});
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message:'Internal Server Error'
        });
    }
}
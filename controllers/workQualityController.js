const WorkQuality = require('../models/workQualityModel');
const projectModel = require('../models/ProjectModel');
const scopeWorkModel = require('../models/scopeWorkModel');

class WorkQualityController {
  async createWorkQuality(req, res) {
    try {
      // Destructure required fields from the request body
      const { ProjectID, WorkID, WorkName, TotalWork, Current_Date , Allignment, Accesories, SiliconIn, SiliconOut, Behaviour, Comment } = req.body;

      if (isNaN(ProjectID) || isNaN(WorkID))
        return res.status(400).json({
          message:`Bad Request: Missing Required Fields`
        })

      const [isProjectExists] = await projectModel.fetchProjectByID(ProjectID);
      if (isProjectExists.length === 0) {
        return res.status(404).json({
          message: `Project with ID ${ProjectID} does not exist.`
        })
      }
      const projectName = isProjectExists[0].ProjectName;

      const [isScopeWorkExist] = await scopeWorkModel.getScopeWorkById(WorkID);
      if (isScopeWorkExist.length === 0){
        return res.status(400).json({
          message:`Scope of Work with ID ${WorkID} does not exist.`
        })
      };
      const scopeWorkName = isScopeWorkExist.Work_Name;
      // Construct the new work quality object
      // const newWorkQuality = {
      //   ProjectID,
      //   WorkID,
      //   WorkName,
      //   TotalWork,
      //   Allignment: Allignment || 0,
      //   Accesories: Accesories || 0,
      //   SiliconIn: SiliconIn || 0,
      //   SiliconOut: SiliconOut || 0,
      //   Behaviour: Behaviour || '',
      //   Coment: Coment || '',
      // };

      // Call the model method to create the work quality
      const result = await WorkQuality.AddWorkQuality(ProjectID, WorkID, WorkName,Current_Date, TotalWork, Allignment, Accesories, SiliconIn, SiliconOut, Behaviour, Comment);

      // Return success response
      return res.status(201).json({ 
        message: `Work quality created successfully for ${projectName} & ${scopeWorkName}`,
        id: result.insertId });
    } catch (error) {
      // Return error response
      return res.status(500).json({ error: error.message });
    }
  }



  async getWorkQualityById(req, res) {
    try {
      const workQualityId = req.params.id;
      // console.log(workQualityId);
      const [result] = await WorkQuality.getWorkQualityById(workQualityId);
      console.log(result[0]);

      if (result.length === 0) {
        return res.status(404).json({ message: 'Work quality not found' });
      }

      return res.status(200).json(result[0]);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async updateWorkQuality(req, res) {
    const workQualityId = req.params.id;
    console.log(workQualityId);
    if (isNaN(workQualityId)){
      return res.status(400).json({
        message:`Bad Request: Missing Required Parameter.`,
        WorkQualityID: workQualityId,
        Type: typeof(workQualityId)
      });
    };

    const {         
      TotalWork,
      Allignment,
      Current_Date,
      Accesories,
      SiliconIn,
      SiliconOut,
      Behaviour,
      Comment 
    } = req.body;
   console.log({TotalWork,
    Allignment,
    Current_Date,
    Accesories,
    SiliconIn,
    SiliconOut,
    Behaviour,
    Comment })
    
    try {
      const [isReportExists] = await WorkQuality.getWorkQualityById(workQualityId);

      if (isReportExists.length === 0){
        return res.status(404).json({
          message:`404: No Report Exists with ID: ${workQualityId}`,
      });
      }

      const [result] = await WorkQuality.updateWorkQuality(workQualityId,TotalWork, Allignment, Current_Date, Accesories, SiliconIn, SiliconOut, Behaviour, Comment);
      if (result.changedRows < 1){
        console.log(result);
        if (result.affectedRows < 1)
            return res.status(404).json({
                message:`404: No Rows Matched`,
                Info: result.Info
            });
        return res.status(201).json({
            message:`No modification required`,
            info: result.info
        });
    }

      return res.status(200).json({ message: 'Work quality updated successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  }

  async deleteWorkQuality(req, res) {
    const workQualityId = req.params.id;

    try {
      const workQuality = await WorkQuality.deleteWorkQuality(workQualityId);

      if (workQuality[0].affectedRows < 1) 
      return res.status(404).json({
        message:`404: No Rows affected`
      });

      return res.status(200).json({ message: 'Work quality deleted successfully' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async getAllWorkQuality(req, res) {
    try {
      const [workQuality] = await WorkQuality.getAllWorkQuality();
      if (workQuality.length === 0) {
        return res.status(404).json({
          message:`440: No report exists`
        })
      };
      // console.log(workQuality);
      return res.status(200).json(workQuality);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async getWorkQualityByProject(req, res) {
    try {
      const projectId = req.params.id;
      const [result] = await WorkQuality.getWorkQualityByProject(projectId);

      if (result.length === 0) {
        return res.status(404).json({ message: 'Work quality for the project not found' });
      }

      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  getWorkQualityByScopeWorkID = async (req, res) => {
    const scopeWorkID = req.params.scopeWorkID;

    if (isNaN(scopeWorkID)){
      return res.status(400).json({
        message:`Bad Request: Missing Required Fields`
      });
    }

    try{
      const [result] = await WorkQuality.getWorkQualityByScopeWorkID(scopeWorkID);
      console.log(result);
      if (result.length < 1)
        return res.status(200).json(false);
        // return res.status(404).json({
        //   message:"404: No Work Quality Report found.",
        //   Info: result.Info
        // });
  
      return res.status(200).json(result);
    } catch(error){
      return res.status(500).json({
        message: `Internal Server Error`,
        Error: error
      })
    }
  }
}

module.exports = new WorkQualityController();

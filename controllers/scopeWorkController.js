const ScopeWork = require('../models/scopeWorkModel');
const connection = require('../config/connection')

class ScopeWorkController {
  async createScopeWork(req, res) {
    const { workName, description, status, projectId, sqrft } = req.body;
      if (isNaN(projectId)) 
      return res.status(400)
          .json({message:"Bad Request: Missing required fields", projectId: projectId || null});
      if(!workName  )
      return res.status(400)
      .json({
          message:'Bad Request: Missing Required Fields', 
          workName: workName || null, 
      });
    try {
      
      const newScopeWork = {
        Work_Name: workName,
        Description: description,
        Status: status,
        ProjectID: projectId,
        sqrfoot: sqrft
      };

      const result = await ScopeWork.createScopeWork(newScopeWork);

      return res.status(201).json({ message: 'Scope work created successfully', id: result.insertId });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  async getScopeWorkByProjectId(req, res) {
    const ProjectId = req.params.ProjectId;
    if (isNaN(ProjectId)) return res.status(400)
        .json({
            message:`Bad Request: ProjectID is ${ProjectId || null}`
        });
    try {
      
      const result = await ScopeWork.getScopeOfWorkByProjectId(ProjectId);

      if (!result.length) {
        res.status(404).json({ message: 'Scope work not found' });
        return;
      }

      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  async getScopeWorkById(req, res) {
    try {
      const workId = req.params.id;
      
      if (isNaN(workId)){
        return res.status(400).json({ error: 'Work ID is required.' });
      }
      const result = await ScopeWork.getScopeWorkById(workId);

      if (!result.length) {
        return res.status(404).json({ message: 'Scope work not found' });
      }

      return res.status(200).json(result[0]);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async updateScopeWork(req, res) {
    try {
      const workId = req.params.id;
      const { workName, description, sqrft } = req.body;

      const updatedScopeWork = {
        Work_Name: workName,
        Description: description,
        sqrfoot: sqrft
      };

      await ScopeWork.updateScopeWork(workId, updatedScopeWork);
      return res.status(201).json({ message: 'Scope work updated successfully' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  async updateScopeWorkByStatus(req, res) {
    const workId = req.params.id;
    const { status } = req.body;
    console.log(status);
    if(isNaN(workId)){
      return res.status(400).json({
        message:`Bad Request: Required fields not correct datatype`,
        workId: workId||null
      })
    }
    if(isNaN(status)){
      return res.status(400).json({
        message:"Bad Request: Invalid Status",
        status: status || null,
        type: typeof(status)
      })
    }
    try {
     const updatedScopeWork = {
        Status:status,
      };

     await ScopeWork.updateStatusScopeWork(workId, updatedScopeWork);
       
      res.status(200).json({ message: 'Scope of work Status Updated successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async getWorkName (req,res){
    const workId = req.params.id;
    // console.log(workId);
    try {
      
      const workName = await ScopeWork.getScopeWorkNameByID(workId);
      res.status(200).json(workName);
    } catch (error) {
      res.status(500).json({error:error.message});
    }
  }

  async getAllScopeWork(req, res) {
    try {
      const scopeWork = await ScopeWork.getAllScopeWork();
      return res.status(200).json(scopeWork);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }


  async getScopeWorkByProject(req, res) {
    try {
      const projectId = req.params.id;
      const result = await ScopeWork.getScopeWorkByProject(projectId);

      if (!result.length) {
        res.status(404).json({ message: 'Scope work for the project not found' });
        return;
      }

      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  deleteScopeWork = async (req, res) => {
    const workIdData = req.params;

    const workId = workIdData.workId;

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
  
      res.status(200).json({ message: 'Work and its related data deleted successfully' });
    } catch (error) {
      console.error('Error executing queries: ' + error);
      res.status(500).json({ message: 'Failed to delete work and its related data' });
    }
  };
  
}


module.exports = new ScopeWorkController();

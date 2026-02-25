const DailyProgressModel = require('../models/DailyProgressModel');
const projectModel = require('../models/ProjectModel');
const multer = require('multer');
const upload = multer({ dest: '../upload' }); 

function isValidDateFormat(dateString){
    const regex = /^\d{4}-\d{2}-\d{2}$/;    // checks the date format of YYYY-MM-DD

    return regex.test(dateString);
};
exports.logProgress = async (req, res) => {
    const {name, details, media, date, projectID} = req.body;

    if (isNaN(projectID))
        return res.status(400).json({
            message:`Bad Request: ProjectID type is ${typeof(projectID)}`
        });
    
    const [isProjectExist] = await projectModel.fetchProjectByID(projectID);
    if (isProjectExist.length === 0) 
        return res.status(404).json({
            message:`Project with ${projectID} does not exist`
        });

    if (!name)
        return res.status(400).json({
            message: `Bad Request: Name is ${name} and Type is ${typeof(name)}`
        });

    if (!isValidDateFormat(date))
        return res.status(400).json({
            message: `Bad Request: Date format is not correct.`,
            Date: date
        });

    try{
        upload.single('media')(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({
                    message: 'File upload error',
                    error: err
                });
            } else if (err) {
                return res.status(500).json({
                    message: 'Internal Server Error',
                    error: err
                });
            }

            const media = req.file ? req.file.path : null;

            await DailyProgressModel.logProgress(name, details, media, date);
            return res.status(201).json({
                message: 'Progress logged'
            });
        });
    } catch (error){
        return res.status(500).json({
            message:`Internal Server Error`,
            error
        });
    }
};

exports.updateProgress = async (req, res) => {
    const { name, details, date } = req.body;
    const progressId = req.params.progressId;
  
    try {
      const updatedProgress = await DailyProgressModel.updateProgressById(progressId, name, details, date);
  
      if (!updatedProgress) {
        return res.status(404).json({
          message: `Progress with ID ${progressId} not found`
        });
      }
      
      // Need to check affected rows
      return res.status(200).json({
        message: 'Progress updated successfully'
      });
    } catch (error) {
      return res.status(500).json({
        message: `Internal Server Error`,
        error
      });
    }
}
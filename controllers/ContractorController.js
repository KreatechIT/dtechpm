const ContractorModel = require("../models/ContractorModel");
const { RateLimiterMemory } = require("rate-limiter-flexible");
const { createClient } = require("redis");
const { promisify } = require("util");
const redisClient = createClient();

const Joi = require("joi");
const WorkerModel = require("../models/WorkerModel");
const AssignWorkerModel = require("../models/AssignWorkerModel");

// const rateLimiter = new RateLimiterMemory({
//     points: 10, // 10 requests
//     duration: 1, // per 1 second
// });

// const rateLimiterMiddleware = async (req, res, next) => {
//     try {
//         await rateLimiter.consume(req.ip);
//         next();
//     } catch (error) {
//         res.status(429).json({ success: false, message: 'Too Many Requests' });
//     }
// };

exports.createContractor = async (req, res) => {
  const { name, contact, address, BGroup } = req.body;
  console.log(name, contact, address, BGroup);
  try {
    const result = await ContractorModel.createContractor(
      name,
      contact,
      address,
      BGroup
    );

    // redisClient.del('allContractors');

    res.status(201).json({
      success: true,
      message: "Contractor created successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error creating contractor:", error);
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

exports.getAllContractors = async (req, res) => {
  try {
    const [contractors] = await ContractorModel.getContractorAll();
    res
      .status(200)
      .json({
        success: true,
        message: "Contractors retrieved from database",
        data: contractors,
      });
    // const cacheKey = 'allContractors';
    // const cachedData = await promisify(redisClient.get).bind(redisClient)(cacheKey);

    // if (cachedData) {
    //     // If data is found in cache, return
    //     const contractors = JSON.parse(cachedData);
    //     res.status(200).json({ success: true, message: 'Contractors retrieved from cache', data: contractors });
    // } else {
    //     // else, we fetch it from DBS
    //     const contractors = await ContractorModel.getContractorAll();
    //     // caching the data
    //     redisClient.set(cacheKey, JSON.stringify(contractors));
    //     res.status(200).json({ success: true, message: 'Contractors retrieved from database', data: contractors });
    // }
  } catch (error) {
    console.error("Error retrieving contractors:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to retrieve contractors" });
  }
};

// setInterval(() => {
//     if (redisClient.status === 'end') {
//         console.error('Redis connection closed unexpectedly. Reconnecting...');
//         redisClient.connect();
//     }
// }, 1000 * 60);

// module.exports = { rateLimiterMiddleware };

exports.getContractorName = async (req, res) => {
  const { contractorID } = req.params;

  if (isNaN(contractorID))
    return res.status(400).json({
      message: `Bad Request: Missing Required Fields`,
      contractorID: contractorID,
      type: typeof contractorID,
    });

  try {
    const result = await ContractorModel.getContractorName(contractorID);

    if (result[0].length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Contractor not found" });
    }

    const contractorName = result[0][0].name;
    res
      .status(200)
      .json({
        success: true,
        message: "Contractor name retrieved successfully",
        data: { name: contractorName },
      });
  } catch (error) {
    console.error("Error retrieving contractor name:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to retrieve contractor name" });
  }
};

exports.getContractor_CID = async (req, res) => {
  const { contractorID } = req.params;

  if (isNaN(contractorID))
    return res.status(400).json({
      message: `Bad Request: Missing Required Fields`,
      contractorID: contractorID,
      type: typeof contractorID,
    });

  try {
    const result = await ContractorModel.getContractorByID(contractorID);
    console.log(result);
    if (result[0].length === 0) {
      return res.status(404).json({
        success: false,
        message: "Contractor not found",
      });
    }

    const contractorInfo = result[0][0];
    res.status(200).json({
      success: true,
      message: "Contractor name retrieved successfully",
      data: contractorInfo,
    });
  } catch (error) {
    console.error("Error retrieving contractor name:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve contractor name",
    });
  }
};

const updateContractorSchema = Joi.object({
  name: Joi.string().required(),
  contact: Joi.string().required(),
  address: Joi.string().required(),
  BGroup: Joi.string().required(),
});

exports.updateContractor = async (req, res) => {
  const { contractorID } = req.params;

  if (isNaN(contractorID))
    return res.status(400).json({
      message: `Bad Request: Missing Required Fields`,
      contractorID: contractorID,
      type: typeof contractorID,
    });

  try {
    const { error } = updateContractorSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    const { name, contact, address, BGroup } = req.body;

    const [updateResult] = await ContractorModel.updateContractor(
      contractorID,
      name,
      contact,
      address,
      BGroup
    );

    if (updateResult.changedRows === 0) {
      if (updateResult.affectedRows === 0) {
        return res.status(404).json({
          message: `404: No Rows Matched`,
          Info: updateResult.Info,
        });
      }
      return res.status(304).json({
        message: "Not Modified",
      });
    }
    return res.status(200).json({
      message: `Successful: ${updateResult.info}`,
    });
  } catch (error) {
    console.error("Error updating contractor:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update contractor",
    });
  }
};

exports.deleteContracter_ID = async (req, res) => {
  const { contractorID } = req.params;

  if (isNaN(contractorID)) {
    return res.status(401).json({
      message: "BAD REQUEST: MISSING REQUIRED FIELD",
      typeof: typeof contractorID,
      contractorID: contractorID,
    });
  }

  try {
    const [workerIDList] = await WorkerModel.getWorker_CID(contractorID);

    if (workerIDList.length !== 0) {
      for (const iterator of workerIDList) {
        const workerID = iterator.worker_id;
        const [assignedWorkerDeleteResult] =
          await AssignWorkerModel.deleteAssiged_WID(workerID);
      }

      await WorkerModel.deleteWorker_CID(contractorID);
    }

    const [result] = await ContractorModel.deleteContractor(contractorID);

    if (result.affectedRows === 0) {
      return res.status(304).json({
        message: "No modification",
      });
    }

    return res.status(200).json({
      message: "SUCCESS",
    });
  } catch (error) {
    return res.status(500).json({
      message: "INTERNAL SERVER ERROR",
      error: error,
    });
  }
};

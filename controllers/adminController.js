const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const AdminModel = require('../models/AdminModel');

exports.adminRegistration = async(req, res) => {
    const {name, email, password} = req.body;
    if (name == undefined || email == undefined || password == undefined){
        return res.status(400).send("Bad Request: Missing required fields");
    }

    try{
        const hash = await bcrypt.hash(password, 10);

        const [result] = await AdminModel.checkEmailExists(email);
        if(result.length > 0)
            return res.status(409)
            .json({
                message:"Confict: Account with email exists", 
                Email: result[0].Email
            });

        await AdminModel.insertAdmin(name, email, hash);
        return res.status(201)
            .json({
                message:"Created: Admin Registered", 
                Name: name, 
                Email: email
            });
    } catch (error){
        return res.status(500).json({message:"Internal Server Error:", error});
    }
}

exports.adminLogin = async (req, res) => {
    try{
        const jwtSecret = process.env.JWT_SECRET;

        const {email, password} = req.body;

        if(!email || !password) 
        return res.status(401)
            .send({message:"Required fields are undefined", "Email: ":email || null, "Password: ": password || null});

        const [result] = await AdminModel.checkEmailExists(email);
        if (result.length === 0) return res.status(404).json("Email not registered");

        const admin = result[0];
        bcrypt.compare(password, admin.Password, (error, match) => {
            if (error) return res.status(500).json({message:"Bcrypt error", error});
            if (!match){
                return res.status(401).json('Invalid password');
            }
            const expiredInSeconds = 24*60*60;   // 24hours in seconds

            const tokenPayload = {
                Email:admin.Email,
                AdminID:admin.AdminID,
                Picture:admin.Picture};
            console.log(tokenPayload);
            const token = jwt.sign(tokenPayload, jwtSecret,{
                expiresIn: expiredInSeconds, // Login expires in 24 hours
            });

            return res.status(200).json({admin:tokenPayload , token});
        })
    } catch (error){
        return res.status(500).json({message:"Internal Server Error:", error});
    }
};

exports.adminUpdate = async (req, res) => {
    const { AdminID } = req.params;
    const { Name, Email } = req.body;
    let picturePath;
    if (req.file) {
      picturePath = req.file.filename;
    }
    if (!AdminID) return res.status(400).json({ message: "AdminID is undefined" });
  
    try {
      const [fetchEmail] = await AdminModel.fetchEmailbyID(AdminID);
      if (!fetchEmail || fetchEmail.length === 0) {
        return res.status(404).json({ message: "Admin not found" });
      }
  
      if (fetchEmail[0].Email !== Email) {
        const [isEmailExist] = await AdminModel.checkEmailExists(Email);
        if (isEmailExist.length > 0) {
          return res.status(409).json({
            message: "Confict: Account with email exists",
            Email: isEmailExist[0].Email
          });
        }
      }
  
      const [updatedResult] = await AdminModel.updateInfo(Name, Email, picturePath, AdminID);
  
      return res.status(200).json({ message: "Information updated", updatedResult });
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY")
        return res.status(409)
          .json({
            message: "Confict: Account with email exists",
            Error: error.code
          });
      return res.status(500).json({ message: "Internal server error", error });
    }
};


exports.adminPasswordUpdate = async (req, res) => {
    const {AdminID} = req.params;
    const {Password} = req.body;

    if (!AdminID) return res.status(400).json({message:"AdminID is undefined"});

    const [fetchAccount] = await AdminModel.fetchAccount(AdminID);
    if (fetchAccount.length === 0) return res.status(404)
        .json({
            message: "Error: Account with AdminID doesn't exist", 
            AdminID
        });
    
    try{
        bcrypt.compare(Password, fetchAccount[0].Password, async (error, match) => {
            if (error) 
                return res.status(500).json({message: "Bcrypt Error", error});
            if (match)
                return res.status(300)
                    .json({message: "Password matched. Update with new password"});
    
                const newHash = await bcrypt.hash(Password, 10);
                const [updatedResult] = await AdminModel.updatePassword(newHash, AdminID);
                console.log(updatedResult)
                return res.status(200).json({message:"Password updated", Info:updatedResult.info});
        });
    } catch (error){
        return res.status(500).json({message:"Internal server error", error});
    }
};

exports.fetchAdminInfo = async (req, res) => {
    const {AdminID} = req.params;

    if (!AdminID || isNaN(AdminID)) return res.status(400).json({message: `Bad Request: AdminID is ${AdminID}`});

    try{
        const [result] = await AdminModel.fetchAccount(AdminID);

        if (result.length === 0) return res.status(404).json({message:`Non-Existent: Account with ${AdminID} doesn't exist`});

        const response = {
            Name: result[0].Name,
            Email: result[0].Email,
            Picture: result[0].Picture
        }
        return res.status(200).json(response);
    } catch (error) {
        console.error("Error: Failed fetching admin account:", error);
        return res.status(500).json({message:"Internal server error", error});
    }
};
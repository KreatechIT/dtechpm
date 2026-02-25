// controllers/userController.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");

const MaterialRequisitionModel = require("../models/MaterialRequisitionModel");
const AssignEngineerModel = require("../models/AssignEngineerModel");
const RequestedItemModel = require("../models/RequestedItemModel");
const QCModel = require("../models/QCModel");

class UserController {
  async registerUser(req, res) {
    try {
      const { name, email, password } = req.body;

      // Check if a file is provided in the request
      let filename;
      if (req.file) {
        filename = req.file.filename;
      }

      // Check if the user with the provided email already exists
      const existingUser = await User.getUserByEmail(email);

      if (existingUser && existingUser.length > 0) {
        // User with the same email already exists
        res.status(400).json({ error: "User with this email already exists" });
        return;
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = {
        Name: name,
        Email: email,
        Password: hashedPassword,
        Photo: filename, // Add the filename to the user object if it exists
      };

      const result = await User.createUser(newUser);

      res
        .status(201)
        .json({ message: "User registered successfully", id: result.insertId });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async loginUser(req, res) {
    try {
      const { email, password } = req.body;
      console.log({ email, password });
      // Check if the user with the provided email exists
      const user = await User.getUserByEmail(email);
      console.log(email);
      if (!user || user.length === 0) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }
      // Compare the provided password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, user[0].Password);
      console.log(isPasswordValid);
      if (!isPasswordValid) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      // Create a JWT token
      const token = jwt.sign(
        { userId: user[0].UserID },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      console.log(token);
      res.status(200).json({ token, userId: user[0].UserID });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async editUser(req, res) {
    try {
      const userId = req.params.id;
      const { Name, Email, Password, Contact } = req.body;

      // Hash the password if provided
      let hashedPassword;
      if (Password) {
        hashedPassword = await bcrypt.hash(Password, 10);
      }

      const updatedUser = {
        Name: Name,
        Email: Email,
        Password: hashedPassword,
        Contact: Contact,
      };

      // Check if a file is provided in the request
      if (req.file) {
        updatedUser.Photo = req.file.filename;
      }

      await User.updateUser(userId, updatedUser);

      res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // study the dbs and see the relation between tables. Otherwise this block is nearly impossible to understand
  async deleteUser(req, res) {
    try {
      const { userId } = req.params;

      // console.log('AssignEngineerModel.fetchAssignID_userID(userId);')
      const [assignIDList] =
        await AssignEngineerModel.fetchAssignID_userID(userId);
      // console.log(assignIDList)

      for (const item of assignIDList) {
        // console.log('MaterialRequisitionModel.getMR_assignedID(item.AssignID)');
        const [materialRequisitions] =
          await MaterialRequisitionModel.getMR_assignedID(item.AssignID);

        for (const mr of materialRequisitions) {
          const MR_ID = mr.MaterialRequisitionID;
          // console.log('RequestedItemModel.fetchQCID_RequestedID(MR_ID)');
          const [requestItemIDList] =
            await RequestedItemModel.fetchQCID_RequestedID(MR_ID);

          for (const iterator of requestItemIDList) {
            // console.log('terator.RequestedItemID;');
            const reqID = iterator.RequestedItemID;
            await QCModel.deleteQCReport(reqID);
          }

          await RequestedItemModel.deleteRequestItem_MRID(MR_ID);

          // console.log('MaterialRequisitionModel.deleteMR_assignedID(iterator.AssignID)');
          await MaterialRequisitionModel.deleteMR_assignedID(item.AssignID);
        }
      }

      // console.log('AssignEngineerModel.deleteAllAssignedByUser(userId)');
      await AssignEngineerModel.deleteAllAssignedByUser(userId);

      // console.log('await User.deleteUser(userId)');
      const [result] = await User.deleteUser(userId);
      // console.log(result);

      if (result.affectedRows === 0) {
        return res.status(304).json({
          message: "No modification",
        });
      }

      return res.status(200).json({
        message: "SUCCESS",
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getUserById(req, res) {
    try {
      const userId = req.params.id;
      const result = await User.getUserById(userId);

      if (!result.length) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      const user = result[0];

      // Filter sensitive information (e.g., password) before sending the response
      const filteredUser = {
        UserID: user.UserID,
        Name: user.Name,
        Email: user.Email,
        Contact: user.Contact,
        Photo: user.Photo,
      };

      res.status(200).json(filteredUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await User.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updatePasswordAndEmail(req, res) {
    try {
      const userId = req.params.id;
      const { password, email } = req.body;

      // Check if the new email is already in use by another user (excluding the current user)
      const existingUser = await User.getUserByEmailExcludingId(email, userId);

      if (existingUser && existingUser.length > 0) {
        return res
          .status(400)
          .json({ error: "Email is already in use by another user" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Update password and email
      await User.updatePasswordAndEmail(userId, hashedPassword, email);

      res
        .status(200)
        .json({ message: "Password and Email updated successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new UserController();

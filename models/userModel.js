// models/userModel.js
const db = require('../config/connection');

class User {

  createUser(user) {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO User SET ?', [user], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  getUserByEmail(email) {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM User WHERE Email = ?', [email], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  getUserById(id) {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM User WHERE UserID = ?', [id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  updateUser(id, user) {
    return new Promise((resolve, reject) => {
      db.query('UPDATE User SET ? WHERE UserID = ?', [user, id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  static async deleteUser(id) {
    return await
      db.promise().query('DELETE FROM User WHERE UserID = ?', [id]);
  }

  getAllUsers() {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM User', (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }



  updatePasswordAndEmail(userId, newPassword, newEmail) {
    return new Promise((resolve, reject) => {
      db.query('UPDATE User SET Pass = ?, Email = ? WHERE UserID = ?', [newPassword, newEmail, userId], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  getUserByEmailExcludingId(email, userId) {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM User WHERE Email = ? AND UserID != ?', [email, userId], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  async getUserNameByID(userID){
    const sqlQuery = "SELECT Name, Email FROM User WHERE UserID = ?";
    return await db.promise().query(sqlQuery, [userID]);
  }
}

module.exports = new User();

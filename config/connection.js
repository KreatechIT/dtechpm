const mysql = require('mysql2');

const connection = mysql.createConnection({
    port: process.env.DB_PORT,
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

connection.connect((error) => {
    if (error){
        console.error("Error connecting with DB:", error);
    } else {
        console.error("Connected to DB in port:", process.env.DB_PORT);
    }
});

module.exports = connection;
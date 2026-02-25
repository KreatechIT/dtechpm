const mysql = require('mysql2');

const connection = mysql.createPool({
    port: process.env.DB_PORT || 3306,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

// Test connection
connection.getConnection((err, conn) => {
    if (err) {
        console.error("Error connecting to DB:", err.message);
    } else {
        console.log("Connected to DB successfully");
        conn.release();
    }
});

module.exports = connection;
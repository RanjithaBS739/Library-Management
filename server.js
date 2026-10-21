// MySQL connection pool
const db = mysql.createPool({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: Number(process.env.MYSQLPORT),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test MySQL connection
db.getConnection((err, connection) => {
    if (err) {
        console.log("MySQL connection failed:", err.message);
        return;
    }

    console.log("MySQL connected successfully!");
    connection.release();
});
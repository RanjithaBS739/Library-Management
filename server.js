
require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// MySQL connection pool
const db = mysql.createPool({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: Number(process.env.MYSQLPORT || 3306),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test MySQL connection
db.getConnection((err, connection) => {
    if (err) {
        console.error("MySQL connection failed:", err.message);
        return;
    }

    console.log("MySQL connected successfully!");
    connection.release();
});

// Get all books
app.get("/books", (req, res) => {
    db.query("SELECT * FROM books", (err, results) => {
        if (err) {
            console.error("Get books error:", err.message);
            return res.status(500).json({
                message: "Unable to fetch books"
            });
        }

        res.json(results);
    });
});

// Add a book
app.post("/books", (req, res) => {
    const { name, author } = req.body;

    if (
        typeof name !== "string" ||
        typeof author !== "string" ||
        !name.trim() ||
        !author.trim()
    ) {
        return res.status(400).json({
            message: "Book name and author are required"
        });
    }

    const sql = "INSERT INTO books (name, author) VALUES (?, ?)";

    db.query(sql, [name.trim(), author.trim()], (err, result) => {
        if (err) {
            console.error("Add book error:", err.message);
            return res.status(500).json({
                message: "Unable to add book"
            });
        }

        res.status(201).json({
            message: "Book added successfully!",
            id: result.insertId
        });
    });
});

// Delete a book
app.delete("/books/:id", (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: "Invalid book ID"
        });
    }

    db.query("DELETE FROM books WHERE id = ?", [id], (err, result) => {
        if (err) {
            console.error("Delete book error:", err.message);
            return res.status(500).json({
                message: "Unable to delete book"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        res.json({
            message: "Book deleted successfully!"
        });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

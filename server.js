const express = require("express");
const mysql = require("mysql2");

const app = express();

const PORT = 3000;

// Allow JSON data
app.use(express.json());

// Connect frontend files
app.use(express.static("public"));

// MySQL connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Library@123",
    database: "library_db"
});

// Test MySQL connection
db.connect((err) => {
    if (err) {
        console.log("MySQL connection failed!");
        console.log(err.message);
        return;
    }

    console.log("MySQL connected successfully!");
});

// Get all books
app.get("/books", (req, res) => {

    db.query("SELECT * FROM books", (err, results) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Database error"
            });
        }

        res.json(results);
    });

});

// Add a book
app.post("/books", (req, res) => {

    const { name, author } = req.body;

    if (!name || !author) {
        return res.status(400).json({
            message: "Book name and author are required"
        });
    }

    const sql =
        "INSERT INTO books (name, author) VALUES (?, ?)";

    db.query(sql, [name, author], (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                message: "Unable to add book"
            });
        }

        res.json({
            message: "Book added successfully!",
            id: result.insertId
        });

    });

});
// Delete a book
app.delete("/books/:id", (req, res) => {

    const id = req.params.id;

    const sql = "DELETE FROM books WHERE id = ?";

    db.query(sql, [id], (err, result) => {

        if (err) {
            console.log("Delete error:", err);

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
    console.log(`Server is running at http://localhost:${PORT}`);
});

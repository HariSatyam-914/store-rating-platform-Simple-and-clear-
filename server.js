const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "store_ratings"
});

db.connect(err => {
    if (err) throw err;
    console.log("MySQL Connected...");
});

// User Registration
app.post("/register", async (req, res) => {
    const { name, email, password, address, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.query("INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)", 
        [name, email, hashedPassword, address, role], 
        (err, result) => {
            if (err) return res.status(500).send(err);
            res.send({ message: "User registered successfully" });
        }
    );
});

// User Login
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (err || results.length === 0) return res.status(400).send("Invalid credentials");
        const user = results[0];
        
        if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user.id, role: user.role }, "secret", { expiresIn: "1h" });
            res.json({ token, user });
        } else {
            res.status(400).send("Invalid credentials");
        }
    });
});

// Get all stores
app.get("/stores", (req, res) => {
    db.query("SELECT * FROM stores", (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// Add a store (Admin only)
app.post("/stores", (req, res) => {
    const { name, email, address } = req.body;
    db.query("INSERT INTO stores (name, email, address) VALUES (?, ?, ?)", 
        [name, email, address], 
        (err, result) => {
            if (err) return res.status(500).send(err);
            res.send({ message: "Store added successfully" });
        }
    );
});

// Submit Rating
app.post("/rate", (req, res) => {
    const { user_id, store_id, rating } = req.body;
    db.query("INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)", 
        [user_id, store_id, rating], 
        (err, result) => {
            if (err) return res.status(500).send(err);
            res.send({ message: "Rating submitted" });
        }
    );
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

import express from "express";
import mysql2 from "mysql2";
import cors from "cors";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const db = mysql2.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

const jwtSecret = process.env.JWT_SECRET;

app.use(express.json());
app.use(cors());

// Register Route
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const q = "INSERT INTO users (`username`, `email`, `password`) VALUES (?, ?, ?)";
        const values = [username, email, hashedPassword];

        db.query(q, values, (err) => {
            if (err) return res.status(500).json({ error: "Database error", err });
            return res.status(201).json({ message: "User registered successfully" });
        });
    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({ error: "Error registering user" });
    }
});

// Login Route
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const q = "SELECT * FROM users WHERE email = ?";
    db.query(q, [email], async (err, results) => {
        if (err) return res.status(500).json({ error: "Database error", err });
        if (results.length === 0) return res.status(400).json({ error: "Invalid email or password" });

        const user = results[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid email or password" });

        const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '1h' });

        res.json({ message: "Login successful", token });
    });
});

// Middleware to authenticate JWT
const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return res.sendStatus(401); 

    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) return res.sendStatus(403); 

        req.user = user;
        next(); 
    });
};

// Books Routes

// Get all books for the authenticated user
app.get('/books', authenticateJWT, (req, res) => {
    const userId = req.user.id; 
    
    const q = `
        SELECT books.*, users.username 
        FROM books 
        JOIN users ON books.user_id = users.id 
        WHERE books.user_id = ?
    `;
    
    db.query(q, [userId], (err, data) => {
        if (err) return res.status(500).json({ error: 'Database error', err });
        return res.json(data);
    });
});

// Add a new book
app.post('/books', authenticateJWT, (req, res) => {
    const userId = req.user.id; 
    const { title, description, cover, review } = req.body;

    const query = 'INSERT INTO books (title, description, cover, review, user_id) VALUES (?, ?, ?, ?, ?)';
    const values = [title, description, cover, review, userId];

    db.query(query, values, (err) => {
        if (err) {
            console.error('Error inserting book:', err);
            return res.status(500).json({ error: 'Failed to add book' });
        }
        res.status(201).json({ message: 'Book added successfully' });
    });
});

// Delete a book
app.delete('/books/:id', authenticateJWT, (req, res) => {
    const userId = req.user.id; 
    const bookId = req.params.id;

    const checkQuery = "SELECT * FROM books WHERE id = ? AND user_id = ?";
    db.query(checkQuery, [bookId, userId], (checkErr, results) => {
        if (checkErr) return res.status(500).json({ error: 'Database error', err: checkErr });
        if (results.length === 0) return res.status(403).json({ error: 'Forbidden' });

        const deleteQuery = "DELETE FROM books WHERE id = ?";
        db.query(deleteQuery, [bookId], (err) => {
            if (err) return res.status(500).json({ error: 'Database error', err });
            return res.json('Book has been deleted successfully.');
        });
    });
});

app.put('/books/:id', authenticateJWT, (req, res) => {
    const userId = req.user.id; 
    const bookId = req.params.id;
    const { title, description, cover, review } = req.body;

    const checkQuery = "SELECT * FROM books WHERE id = ? AND user_id = ?";
    db.query(checkQuery, [bookId, userId], (checkErr, results) => {
        if (checkErr) return res.status(500).json({ error: 'Database error', err: checkErr });
        if (results.length === 0) return res.status(403).json({ error: 'Forbidden' });

        const updateQuery = "UPDATE books SET title = ?, description = ?, cover = ?, review = ? WHERE id = ?";
        const values = [title, description, cover, review, bookId];

        db.query(updateQuery, values, (err) => {
            if (err) return res.status(500).json({ error: 'Database error', err });
            return res.json('Book has been updated successfully.');
        });
    });
});

app.get('/user', authenticateJWT, (req, res) => {
    const userId = req.user.id; 

    const q = "SELECT username FROM users WHERE id = ?";
    db.query(q, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error', err });
        if (results.length === 0) return res.status(404).json({ error: 'User not found' });

        res.json({ username: results[0].username });
    });
});


// Get a single book by ID
app.get('/books/:id', authenticateJWT, (req, res) => {
    const userId = req.user.id; 
    const bookId = req.params.id; 

    const q = `
        SELECT books.*, users.username 
        FROM books 
        JOIN users ON books.user_id = users.id 
        WHERE books.id = ? AND books.user_id = ?
    `;
    
    db.query(q, [bookId, userId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error', err });
        if (results.length === 0) return res.status(404).json({ error: 'Book not found' });
        
        return res.json(results[0]);
    });
});


// Default route
app.get("/", (req, res) => {
    res.json('Hello from the backend');
});

// Start the server
app.listen(8800, () => {
    console.log("Connected to the backend ;)");
});

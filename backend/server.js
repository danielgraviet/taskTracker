// server.js
require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000; // Use environment variable or default

// Middleware
app.use(cors()); // Enable CORS for all origins (adjust for production)
app.use(express.json()); // Allow server to accept JSON data in request body

// --- Database Connection ---
const mongoURI = process.env.MONGO_URI; // Get connection string from .env

if (!mongoURI) {
    console.error("FATAL ERROR: MONGO_URI is not defined in .env file");
    process.exit(1); // Exit if DB connection string is missing
}

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // Mongoose 6+ doesn't require useCreateIndex or useFindAndModify
})
.then(() => console.log('MongoDB Connected...'))
.catch(err => {
    console.error("MongoDB Connection Error:", err);
    process.exit(1); // Exit if connection fails
});

// --- Basic Route ---
app.get('/', (req, res) => {
    res.send('Task Tracker API Running!');
});

// --- Define Task Routes (We'll create this file next) ---
const taskRoutes = require('./routes/tasks');
app.use('/api/tasks', taskRoutes); // Mount task routes under /api/tasks

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
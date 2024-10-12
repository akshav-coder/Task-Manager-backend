const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db"); // Database connection file (for MongoDB)
const userRoutes = require("./routes/userRoutes"); // User authentication routes
const taskRoutes = require("./routes/taskRoutes"); // Task CRUD routes

// Initialize dotenv to load environment variables from the .env file
dotenv.config();

// Initialize the express application
const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(express.json()); // Body parser to parse incoming request bodies
app.use(cors()); // Enable CORS for cross-origin requests

// Basic route to check API is running
app.get("/", (req, res) => {
  res.send("Task Manager API is running");
});

// Routes
app.use("/api/users", userRoutes); // Authentication routes for user registration and login
app.use("/api/tasks", taskRoutes); // Task routes for creating, reading, updating, and deleting tasks

// Error handling middleware (optional, good practice)
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

Task Manager Backend

This repository contains the backend code for the Task Management application. It provides all the necessary API endpoints to manage tasks and user authentication, using Node.js and Express.

Features
1. Task Management: Endpoints for creating, reading, updating, and deleting tasks.
2. Authentication: User authentication using Google OAuth and JWT for secure access to APIs.
3. MongoDB: Database management for persistent storage of tasks and users.
4. Security: JWT (JSON Web Tokens) for user authentication and protecting routes.

Prerequisites
Ensure you have the following installed:

- Node.js (v14+)
- MongoDB (local instance or cloud-based using MongoDB Atlas)

Environment Variables
You need to configure the following environment variables in a .env file at the root of the project:

PORT=5000
MONGO_URI=<your_mongoDB_connection_string>
JWT_SECRET=<your_jwt_secret>
GOOGLE_CLIENT_ID=<your_google_client_id>
GOOGLE_CLIENT_SECRET=<your_google_client_secret>


Installation and Setup
1. Clone the repository: git clone https://github.com/akshav-coder/Task-Manager-backend.git
2. Navigate to the backend directory: cd Task-Manager-backend
3. Install dependencies: npm install
4. Start the server: node server.js
5. The backend will run at http://localhost:5001. Ensure MongoDB is running or connected.

API Endpoints
Authentication
- POST /api/auth/login: Handles Google OAuth login and generates a JWT.

Task Management
- GET /api/tasks: Fetches all tasks for the authenticated user.
- POST /api/tasks: Creates a new task.
- PUT /api/tasks/
  : Updates an existing task by ID.
- DELETE /api/tasks/
  : Deletes a task by ID.

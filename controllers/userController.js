const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc Register a new user
// @route POST /api/users/register
// @access Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Check if the user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({
      message: "User registration failed",
      status_code: 400,
      error: true,
      data: {
        email: "User with this email already exists",
      },
    });
  }

  // Proceed with user registration
  try {
    const user = await User.create({ name, email, password });

    if (user) {
      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      return res.status(400).json({
        message: "User could not be created",
        status_code: 400,
        error: true,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status_code: 500,
      error: true,
    });
  }
};

// @desc Auth user & get token
// @route POST /api/users/login
// @access Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  }

  // If the email is not found
  if (!user) {
    return res.status(401).json({
      message: "Invalid email or password",
      status_code: 401,
      error: true,
      data: {
        email: "Email not found", // Only return this when email doesn't exist
      },
    });
  }

  // If user exists, check password
  if (user && !(await user.matchPassword(password))) {
    return res.status(401).json({
      message: "Invalid email or password",
      status_code: 401,
      error: true,
      data: {
        password: "Incorrect password", // Return only if password is incorrect
      },
    });
  }
};

// @desc Register or Login user with Google
// @route POST /api/users/google
// @access Public
const googleAuthUser = async (req, res) => {
  const { token } = req.body;

  // Check if token is provided
  if (!token) {
    return res.status(422).json({
      message: "Form validation fails",
      status_code: 422,
      error: true,
      data: {
        token: "Google token is required",
      },
    });
  }

  try {
    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    });

    const { name, email, picture } = ticket.getPayload();

    // Check if the user already exists in the database
    let user = await User.findOne({ email });

    if (user) {
      // If user exists, return the user with token (login)
      return res.status(400).json({
        message: "User registration failed",
        status_code: 400,
        error: true,
        data: {
          email: "User with this email already exists",
        },
      });
    } else {
      // If user does not exist, create a new user (register)
      user = await User.create({
        name,
        email,
        password: null, // No password required for Google users
        isGoogleAuth: true, // Flag for Google OAuth user
      });

      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    // Check if the error is due to token verification failure
    if (error.message.includes("invalid_token")) {
      return res.status(401).json({
        message: "Invalid Google token",
        status_code: 401,
        error: true,
      });
    }

    // General error handling (e.g., user creation failed)
    return res.status(500).json({
      message: error.message,
      status_code: 500,
      error: true,
    });
  }
};

module.exports = { googleAuthUser, registerUser, loginUser };

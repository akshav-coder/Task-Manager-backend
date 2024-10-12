const express = require("express");
const {
  registerUser,
  loginUser,
  googleAuthUser,
} = require("../controllers/userController");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleAuthUser);

module.exports = router;

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Make password optional
  isGoogleAuth: { type: Boolean, default: false }, // Add a flag to mark Google OAuth users
});

// Password matching method
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false; // If the user has no password (Google sign-in), return false
  return await bcrypt.compare(enteredPassword, this.password);
};

// Hash password before saving if modified
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);
module.exports = User;

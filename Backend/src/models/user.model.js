const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: [true, "Username already exists"],
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: [true, "Email already exists"],
  },
  password: {
    type: String,
    required: true
  }
});

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
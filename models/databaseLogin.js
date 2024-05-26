const mongoose = require("mongoose");

const Login = mongoose.model("Login", {
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = Login;

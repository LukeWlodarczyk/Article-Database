const mongoose = require('mongoose');

//User schema
const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  img_name: {
    type: String,
    required: true
  },
  register_date: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date
})

const User = module.exports = mongoose.model('User', UserSchema);

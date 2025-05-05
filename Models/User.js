const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'manager'],
    default: 'user',
  },
})

module.exports = mongoose.model('User', userSchema);

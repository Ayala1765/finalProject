const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: { // שם הקטגוריה
    type: String,
    required: true,
    unique: true,
    trim: true
  }
});

module.exports = mongoose.model('Category', CategorySchema);
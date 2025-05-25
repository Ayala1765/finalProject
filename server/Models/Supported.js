const mongoose = require('mongoose');

const SupportedSchema = new mongoose.Schema({
  name: { // שם הנתמך
    type: String,
    required: true,
    trim: true
  },
  contactName: { // שם איש קשר
    type: String,
    trim: true
  },
  contactPhone: { // טלפון איש קשר
    type: String,
    required: true,
    trim: true,
    match: /^[0-9]{10}$/ // וידוא מספר טלפון תקין
  },
  category: { // קטגוריה מתוך מודל קטגוריות
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  }
});

module.exports = mongoose.model('Supported', SupportedSchema);
const mongoose = require('mongoose')
const SupportedSchema = new mongoose.Schema({
  name: { 
    type: String,
    required: true,
    trim: true
  },
  contactName: { 
    type: String,
    trim: true
  },
  contactPhone: { 
    type: String,
    required: true,
    trim: true,
    match: /^[0-9]{10}$/
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  }
})
module.exports = mongoose.model('Supported', SupportedSchema)
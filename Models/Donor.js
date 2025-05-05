const mongoose = require('mongoose')

const DonorSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  userName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  donations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Donation',
      default: []
    }
  ]
})

module.exports = mongoose.model('Donor', DonorSchema);
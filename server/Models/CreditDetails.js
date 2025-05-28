const mongoose = require('mongoose')
const creditSchema = new mongoose.Schema({
  cardHolderName: {
    type: String,
    required: true,
    trim: true
  },
  cardNumber: { 
    type: String,
    required: true
  },
  expirationDate: {
    type: String,
    required: true
  },
  cvv: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Credit', creditSchema)

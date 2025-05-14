const mongoose = require('mongoose')
const creditSchema = new mongoose.Schema({
  cardHolderName: { // שם בעל הכרטיס
    type: String,
    required: true,
    trim: true
  },
  cardNumber: { // מספר כרטיס אשראי (יש להצפין!)
    type: String,
    required: true
  },
  expirationDate: { // תאריך תפוגה (MM/YY)
    type: String,
    required: true
  },
  cvv: { // קוד CVV (יש להצפין!)
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Credit', creditSchema)

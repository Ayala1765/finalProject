const mongoose = require('mongoose')
const DonationSchema = new mongoose.Schema({
  donationAmount: {
    type: Number,
    required: true,
    min: 0
  },
  donationDate: {
    type: Date,
    default: Date.now
  },
  coinType: {
    type: String,
    enum: ['$', '₪'],
    required: true
  },
  Day: {
    type: Number,
    enum: [15, 14],
    required: true
  },
  notes: {
    type: String,
    required: false,
    trim: true,
    default: ""
  },
  donorUserName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donor', 
    required: true
  },
  event:{
    type:String
  }
})
module.exports= mongoose.model('Donation', DonationSchema);

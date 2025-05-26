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
    type: String,
    enum: ['yd','tv','both','']
  },

  donorId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Donor',
  required: true
},
  event: {
  type: String,
  default: "general"
},
 notes: {
  type: String,
  required: false,
  trim: true,
  default: ""
}
})
module.exports = mongoose.model('Donation', DonationSchema);

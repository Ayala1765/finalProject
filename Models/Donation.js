const mongoose = require('mongoose')
const date=require("date-fns")

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
    enum: [15, 14],
    required: true
  },
  notes: {
    type: String,
    required: false,
    trim: true
  },
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donor', 
    required: true
  }
})
DonationSchema.virtual('formattedDonationDate').get(function () {
  return format(this.donationDate, 'dd/MM/yyyy'); // החזרת התאריך בפורמט מותאם
})
module.exports= mongoose.model('Donation', DonationSchema);

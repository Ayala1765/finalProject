const mongoose = require('mongoose')

const DonorSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  username: {
    type: String,
    required: true,
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
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true
  },
  phone: {
    type: String,
    trim: true
  },
  donations:
  // {
  //   type:String
  // }
[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Donation',
      default: []
    }
  ]
})
const Donor = mongoose.models.Donor || mongoose.model('Donor', DonorSchema);


module.exports = Donor;

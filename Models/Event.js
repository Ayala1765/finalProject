const mongoose = require('mongoose');
const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },
  donations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donation',
    default:[]
  }],
})

module.exports = mongoose.model('Event', eventSchema)
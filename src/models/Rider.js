const mongoose = require('mongoose');

const riderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  vehicleType: String,
  status: {
    type: String,
    enum: ['available', 'assigned', 'inactive'],
    default: 'available'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Rider', riderSchema);

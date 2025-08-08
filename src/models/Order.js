const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pickupLocation: {
    type: String,
    required: true
  },
  dropLocations: [{
    address: { type: String, required: true },
    contactName: String,
    contactPhone: String
  }],
  weight: Number,
  deliveryWindow: {
    start: Date,
    end: Date
  },
  reversePickup: {
    type: Boolean,
    default: false
  },
  rider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rider'
  },
  status: {
    type: String,
    enum: ['assigned', 'in_transit', 'completed', 'cancelled'],
    default: 'assigned'
  },
  podImageUrl: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);

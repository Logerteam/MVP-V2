const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rider: { type: mongoose.Schema.Types.ObjectId, ref: 'Rider', default: null },
  pickupAddress: { type: String, required: true },
  dropoffAddress: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['created', 'assigned', 'in_transit', 'delivered', 'pod_captured'], 
    default: 'created' 
  },
  podImageUrl: { type: String, default: null },
  price: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);

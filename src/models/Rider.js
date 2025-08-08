const mongoose = require('mongoose');

const riderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  isAvailable: { type: Boolean, default: true },
  currentOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null }
}, { timestamps: true });

module.exports = mongoose.model('Rider', riderSchema);

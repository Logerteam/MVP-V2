// src/controllers/orderController.js
const Order = require('../models/Order');
const Rider = require('../models/Rider');

/**
 * Create a new delivery order
 * (Push scenario: customer manually creates delivery)
 */
exports.createOrder = async (req, res) => {
  try {
    const {
      pickupLocation,
      dropLocations,
      weight,
      deliveryWindow,
      reversePickup
    } = req.body;

    // basic validation
    if (!pickupLocation || !dropLocations || !Array.isArray(dropLocations) || dropLocations.length === 0) {
      return res.status(400).json({ error: 'Pickup and at least one drop location are required' });
    }

    // assign first available rider (for MVP: simple random assignment)
    const rider = await Rider.findOne({ status: 'available' });
    if (!rider) {
      return res.status(400).json({ error: 'No available riders' });
    }

    const newOrder = new Order({
      customer: req.user.id,
      pickupLocation,
      dropLocations,
      weight,
      deliveryWindow,
      reversePickup: reversePickup || false,
      rider: rider._id,
      status: 'assigned'
    });

    await newOrder.save();

    // update rider status
    rider.status = 'assigned';
    await rider.save();

    res.status(201).json({
      message: 'Order created and rider assigned',
      order: newOrder
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

/**
 * Mark delivery as complete and capture Proof of Delivery
 */
exports.completeOrder = async (req, res) => {
  try {
    const { id } = req.params;

    // file upload handled by uploadMiddleware
    if (!req.file) {
      return res.status(400).json({ error: 'POD image is required' });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.status = 'completed';
    order.podImageUrl = `/uploads/${req.file.filename}`;
    await order.save();

    // free up rider
    const rider = await Rider.findById(order.rider);
    if (rider) {
      rider.status = 'available';
      await rider.save();
    }

    res.json({ message: 'Order completed and POD captured', order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to complete order' });
  }
};

/**
 * Get all orders for logged in customer
 */
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user.id }).populate('rider', 'name phone');
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

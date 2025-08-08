const Order = require("../models/Order");
const Rider = require("../models/Rider");
const WalletTransaction = require("../models/WalletTransaction");
const User = require("../models/User");

// 1. Create new order
exports.createOrder = async (req, res) => {
    try {
        const { pickup, drop, weight, deliveryWindow, reversePickup, price } = req.body;
        const customerId = req.user._id; // assuming auth middleware

        // Check if customer has enough wallet balance
        const customer = await User.findById(customerId);
        if (customer.walletBalance < price) {
            return res.status(400).json({ message: "Insufficient wallet balance" });
        }

        // Deduct from wallet
        customer.walletBalance -= price;
        await customer.save();

        await WalletTransaction.create({
            userId: customerId,
            type: "debit",
            amount: price,
            description: "Delivery booking"
        });

        // Create order
        const order = await Order.create({
            customerId,
            pickup,
            drop,
            weight,
            deliveryWindow,
            reversePickup,
            price,
            status: "pending"
        });

        res.status(201).json({ message: "Order created", order });
    } catch (error) {
        res.status(500).json({ message: "Error creating order", error: error.message });
    }
};

// 2. Assign rider to order
exports.assignRider = async (req, res) => {
    try {
        const { orderId, riderId } = req.body;

        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: "Order not found" });

        const rider = await Rider.findById(riderId);
        if (!rider || !rider.isAvailable) {
            return res.status(400).json({ message: "Rider not available" });
        }

        // Assign rider
        order.riderId = riderId;
        order.status = "assigned";
        await order.save();

        // Mark rider unavailable
        rider.isAvailable = false;
        await rider.save();

        res.json({ message: "Rider assigned successfully", order });
    } catch (error) {
        res.status(500).json({ message: "Error assigning rider", error: error.message });
    }
};

// 3. Capture proof of delivery
exports.capturePOD = async (req, res) => {
    try {
        const { orderId } = req.body;
        const podImageUrl = req.file ? req.file.path : null; // if using multer

        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: "Order not found" });

        order.proofOfDelivery = podImageUrl;
        order.status = "completed";
        await order.save();

        // Mark rider available again
        const rider = await Rider.findById(order.riderId);
        if (rider) {
            rider.isAvailable = true;
            await rider.save();
        }

        res.json({ message: "POD captured successfully", order });
    } catch (error) {
        res.status(500).json({ message: "Error capturing POD", error: error.message });
    }
};

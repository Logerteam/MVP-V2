const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');
const uploadMiddleware = require('../middlewares/uploadMiddleware');

// Create a new delivery order (Push scenario)
router.post('/', authMiddleware, orderController.createOrder);

// Get all orders for logged in customer
router.get('/', authMiddleware, orderController.getOrders);

// Complete delivery & upload POD
router.post('/:id/complete', authMiddleware, uploadMiddleware.single('podImage'), orderController.completeOrder);

module.exports = router;

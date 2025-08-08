const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware"); // for POD image upload

// Customer creates an order
router.post("/create", authMiddleware, orderController.createOrder);

// Admin/dispatcher assigns rider
router.post("/assign", authMiddleware, orderController.assignRider);

// Rider uploads proof of delivery
router.post("/pod", authMiddleware, upload.single("podImage"), orderController.capturePOD);

module.exports = router;

const express = require("express");
const { createPaymentIntent, confirmPayment } = require("../controllers/stripeController");
const router = express.Router();

router.post("/create-payment-intent", createPaymentIntent);
router.post("/confirm-payment-intent", confirmPayment);

module.exports = router;
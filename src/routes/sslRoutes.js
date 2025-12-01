const express = require("express");
const router = express.Router();
const { createSSLPayment, successSSLPayment } = require("../controllers/sslController");

router.post("/create-payment", createSSLPayment);
router.post("/success-payment", successSSLPayment);

module.exports = router;
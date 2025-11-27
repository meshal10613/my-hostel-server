const express = require("express");
const router = express.Router();
const { createSSLPayment } = require("../controllers/sslController");

router.post("/create-payment", createSSLPayment);

module.exports = router;
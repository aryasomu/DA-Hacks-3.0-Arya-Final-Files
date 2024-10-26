const express = require("express");
const paymentController = require("../controllers/paymentController");
const router = express.Router();

router.post("/crypto", paymentController.processCryptoPayment);

module.exports = router;

const express = require("express");
const loanController = require("../controllers/loanController");
const router = express.Router();

router.post("/loan/calculate", loanController.calculateLoan);

module.exports = router;

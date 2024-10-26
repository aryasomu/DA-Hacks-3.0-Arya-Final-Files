const express = require("express");
const plotController = require("../controllers/plotController");
const router = express.Router();

router.get("/", plotController.getAllPlots);

router.post("/purchase", plotController.purchasePlot);

module.exports = router;

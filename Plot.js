const mongoose = require("mongoose");

const plotSchema = new mongoose.Schema({
    name: { type: String, required: true },
    coordinates: { type: String, required: true },
    price: { type: Number, required: true },
    ownedBy: { type: String, default: "None" },
    status: { type: String, default: "Available" },
    deedId: { type: String, default: null }
});

module.exports = mongoose.model("Plot", plotSchema);

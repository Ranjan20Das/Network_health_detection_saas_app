const mongoose = require("mongoose");

const RegionSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    target: { type: String, required: true },       // ping / network target
    httpTarget: { type: String, required: false }, // optional HTTP check
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Region", RegionSchema);
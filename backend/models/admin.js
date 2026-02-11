const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isPermanent: { type: Boolean, default: false }
});

module.exports = mongoose.model("Admin", AdminSchema);
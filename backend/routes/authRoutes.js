const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");
// Register Admin (optional, you can seed manually)
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existing = await Admin.findOne({ email });
        if (existing) return res.status(400).json({ message: "Admin already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = new Admin({ username, email, password: hashedPassword });
        await admin.save();

        res.status(201).json({ message: "Admin registered ✅" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// Login Admin
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET, {
            expiresIn: "1d"
        });

        res.json({ message: "Login successful ✅", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// DELETE admin by ID (protected)
router.delete("/admin/:id", authMiddleware, async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);
        if (!admin) return res.status(404).json({ message: "Admin not found" });

        // ✅ Prevent permanent admin deletion
        if (admin.isPermanent) {
            return res.status(403).json({ message: "Cannot delete permanent admin!" });
        }

        await Admin.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Admin deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
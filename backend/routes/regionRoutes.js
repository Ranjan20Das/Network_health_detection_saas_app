const express = require("express");
const router = express.Router();
const Region = require("../models/Region");
const auth = require("../middleware/authMiddleware"); // JWT middleware

// GET all regions
router.get("/", auth, async (req, res) => {
    try {
        const regions = await Region.find();
        res.json(regions);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// POST add a new region
router.post("/", auth, async (req, res) => {
    try {
        const { name, target, httpTarget } = req.body;
        const existing = await Region.findOne({ name });
        if (existing) return res.status(400).json({ message: "Region already exists" });

        const region = new Region({ name, target, httpTarget });
        await region.save();
        res.status(201).json({ message: "Region added ✅", region });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// DELETE a region
router.delete("/:id", auth, async (req, res) => {
    try {
        const region = await Region.findByIdAndDelete(req.params.id);
        if (!region) return res.status(404).json({ message: "Region not found" });

        res.json({ message: "Region deleted ✅" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
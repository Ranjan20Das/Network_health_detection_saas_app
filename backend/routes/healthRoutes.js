const express = require("express");
const router = express.Router();
const HealthLog = require("../models/HealthLog");
const auth = require("../middleware/authMiddleware"); // JWT middleware

// GET all health logs (admin only)
router.get("/", auth, async (req, res) => {
    try {
        const logs = await HealthLog.find().sort({ timestamp: -1 });
        res.json(logs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
// Get latest health log per region
router.get("/latest", auth, async (req, res) => {
    try {
        // Aggregate latest log per region
        const latestLogs = await HealthLog.aggregate([
            {
                $sort: { timestamp: -1 } // sort by newest first
            },
            {
                $group: {
                    _id: "$region",
                    region: { $first: "$region" },
                    status: { $first: "$status" },
                    ping: { $first: "$ping" },
                    http: { $first: "$http" },
                    dns: { $first: "$dns" },
                    tcp: { $first: "$tcp" },
                    timestamp: { $first: "$timestamp" }
                }
            }
        ]);

        res.json(latestLogs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// POST agent data (can protect or leave open for agent)
router.post("/log", async (req, res) => {
    try {
        const log = new HealthLog(req.body);
        await log.save();
        res.status(201).json({ message: "Health log saved ✅", log });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error ❌", error: error.message });
    }
});

module.exports = router;
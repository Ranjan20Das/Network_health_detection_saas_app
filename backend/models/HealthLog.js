const mongoose = require("mongoose");

const healthLogSchema = new mongoose.Schema(
    {
        region: {
            type: String,
            required: true,
        },

        timestamp: {
            type: Date,
            default: Date.now,
        },

        status: {
            type: String,
            enum: ["healthy", "warning", "critical"],
            default: "healthy",
        },

        ping: {
            alive: {
                type: Boolean,
                default: false,
            },
            time: {
                type: Number,
                default: 0,
            },
        },

        http: {
            success: {
                type: Boolean,
                default: false,
            },
            responseTime: {
                type: Number,
                default: 0,
            },
        },

        dns: {
            success: {
                type: Boolean,
                default: false,
            },
            resolveTime: {
                type: Number,
                default: 0,
            },
        },

        tcp: {
            success: {
                type: Boolean,
                default: false,
            },
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("HealthLog", healthLogSchema);
require("dotenv").config();
const express = require("express");
const cron = require("node-cron");
const axios = require("axios");
const fetch = require("node-fetch");

const pingHost = require("./pingCheck");
const httpCheck = require("./httpCheck");
const dnsCheck = require("./dnsCheck");
const tcpCheck = require("./tcpCheck");

const app = express();
const PORT = process.env.PORT || 10000;
const INTERVAL = process.env.CHECK_INTERVAL || 30;

// Backend config
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";
const AGENT_TOKEN = process.env.AGENT_TOKEN || "";

// Alert thresholds
const thresholds = {
    ping: 200,
    http: 500,
    dns: 300
};

// 🔥 SAFE NUMBER HELPER (prevents "unknown" string crash)
function safeNumber(value) {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
}

// 🔥 Evaluate overall health
function evaluateHealth(ping, http, dns, tcp) {
    let status = "healthy";

    if (!tcp?.success) return "critical";
    if (!ping?.alive) return "critical";
    if (!http?.success) return "critical";
    if (!dns?.success) return "critical";

    if (
        safeNumber(ping?.time) > thresholds.ping ||
        safeNumber(http?.responseTime) > thresholds.http ||
        safeNumber(dns?.resolveTime) > thresholds.dns
    ) {
        status = "warning";
    }

    return status;
}

// 🔥 Fetch regions from backend
async function fetchRegions() {
    try {
        const res = await axios.get(`${BACKEND_URL}/api/regions`, {
            headers: {
                Authorization: `Bearer ${AGENT_TOKEN}`
            }
        });

        return res.data;

    } catch (error) {
        console.error("Failed to fetch regions from backend:", error.message);

        // fallback regions
        return [
            { name: "India", target: "8.8.8.8", httpTarget: "https://google.com" },
            { name: "America", target: "8.8.4.4", httpTarget: "https://example.com" },
            { name: "Russia", target: "1.1.1.1", httpTarget: "https://yandex.com" },
            { name: "China", target: "114.114.114.114", httpTarget: "https://baidu.com" },
            { name: "Australia", target: "1.1.1.2", httpTarget: "https://australia.com" },
            { name: "Japan", target: "8.8.8.8", httpTarget: "https://google.co.jp" }
        ];
    }
}

// 🔥 Run check for one region
async function runCheck(region) {
    try {
        const pingResult = await pingHost(region.target);
        const httpResult = await httpCheck(region.httpTarget);
        const dnsResult = await dnsCheck("google.com");
        const tcpResult = await tcpCheck("google.com", 443);

        const health = evaluateHealth(
            pingResult || {},
            httpResult || {},
            dnsResult || {},
            tcpResult || {}
        );

        const finalResult = {
            region: region.name,
            timestamp: new Date(),
            status: health,
            ping: {
                alive: pingResult?.alive ?? false,
                time: safeNumber(pingResult?.time)
            },
            http: {
                success: httpResult?.success ?? false,
                responseTime: safeNumber(httpResult?.responseTime)
            },
            dns: {
                success: dnsResult?.success ?? false,
                resolveTime: safeNumber(dnsResult?.resolveTime)
            },
            tcp: {
                success: tcpResult?.success ?? false
            }
        };

        console.log(JSON.stringify(finalResult, null, 2));
        console.log("======================================");

        await sendToBackend(finalResult);

    } catch (error) {
        console.error(`Error in ${region.name}:`, error.message);
    }
}

// 🔥 Send to backend
async function sendToBackend(result) {
    try {
        const response = await fetch(`${BACKEND_URL}/api/health/log`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(result),
        });

        const data = await response.json();
        console.log("Backend response:", data.message);

    } catch (error) {
        console.error("Failed to send to backend:", error.message);
    }
}

// 🔥 CRON JOB
cron.schedule(`*/${INTERVAL} * * * * *`, async () => {
    const regions = await fetchRegions();

    for (const region of regions) {
        await runCheck(region);
    }
});

// 🔥 Health route (for Render or local check)
app.get("/", (req, res) => {
    res.json({
        message: "Advanced Monitoring Agent Running",
        interval: INTERVAL + " seconds"
    });
});

// 🔥 Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log("Advanced monitoring agent started...");
});
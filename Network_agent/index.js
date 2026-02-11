require("dotenv").config();
const express = require("express");
const cron = require("node-cron");

const pingHost = require("./pingCheck");
const httpCheck = require("./httpCheck");
const dnsCheck = require("./dnsCheck");
const tcpCheck = require("./tcpCheck");

const app = express();
const PORT = process.env.PORT || 10000;

const TARGET = process.env.TARGET;
const HTTP_TARGET = process.env.HTTP_TARGET;
const INTERVAL = process.env.CHECK_INTERVAL || 30;

const regions = [
    "india",
    "america",
    "australia",
    "russia",
    "china",
    "japan"
];

// Alert thresholds
const thresholds = {
    ping: 200,
    http: 500,
    dns: 300
};

function evaluateHealth(ping, http, dns, tcp) {
    let status = "healthy";

    if (!tcp?.success) return "critical";
    if (!ping?.alive) return "critical";
    if (!http?.success) return "critical";
    if (!dns?.success) return "critical";

    if (
        ping.time > thresholds.ping ||
        http.responseTime > thresholds.http ||
        dns.resolveTime > thresholds.dns
    ) {
        status = "warning";
    }

    return status;
}

async function runCheck(region) {
    try {
        const pingResult = await pingHost(TARGET);
        const httpResult = await httpCheck(HTTP_TARGET);
        const dnsResult = await dnsCheck("google.com");
        const tcpResult = await tcpCheck("google.com", 443);

        const health = evaluateHealth(
            pingResult,
            httpResult,
            dnsResult,
            tcpResult
        );

        const finalResult = {
            region,
            timestamp: new Date(),
            status: health,
            ping: pingResult,
            http: httpResult,
            dns: dnsResult,
            tcp: tcpResult
        };

        console.log(JSON.stringify(finalResult, null, 2));
        console.log("======================================");

    } catch (error) {
        console.error(`Error in ${region}:`, error.message);
    }
}

// ✅ CRON (UNCHANGED LOGIC)
cron.schedule(`*/${INTERVAL} * * * * *`, async () => {
    for (const region of regions) {
        await runCheck(region);
    }
});

// ✅ EXPRESS ROUTE (ONLY FOR RENDER HEALTH CHECK)
app.get("/", (req, res) => {
    res.json({
        message: "Advanced Monitoring Agent Running",
        regions,
        interval: INTERVAL + " seconds"
    });
});

// ✅ START SERVER (THIS IS WHAT RENDER NEEDS)
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log("Advanced monitoring agent started...");
});
const ping = require("ping");

async function pingHost(host) {
    const result = await ping.promise.probe(host);

    return {
        host,
        alive: result.alive,
        time: result.time,
        packetLoss: result.packetLoss
    };
}

module.exports = pingHost;
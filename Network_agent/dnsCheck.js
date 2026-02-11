const dns = require("dns").promises;

async function dnsCheck(domain) {
    const start = Date.now();

    try {
        await dns.lookup(domain);
        const end = Date.now();

        return {
            domain,
            resolveTime: end - start,
            success: true
        };
    } catch (error) {
        const end = Date.now();

        return {
            domain,
            resolveTime: end - start,
            success: false
        };
    }
}

module.exports = dnsCheck;
const axios = require("axios");

async function httpCheck(url) {
    const start = Date.now();

    try {
        const response = await axios.get(url);
        const end = Date.now();

        return {
            url,
            status: response.status,
            responseTime: end - start,
            success: true
        };
    } catch (error) {
        const end = Date.now();

        return {
            url,
            status: error.response?.status || "DOWN",
            responseTime: end - start,
            success: false
        };
    }
}

module.exports = httpCheck;
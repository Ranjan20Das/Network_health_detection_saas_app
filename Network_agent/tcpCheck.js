const net = require("net");

function tcpCheck(host, port, timeout = 3000) {
    return new Promise((resolve) => {
        const start = Date.now();
        const socket = new net.Socket();

        socket.setTimeout(timeout);

        socket.connect(port, host, () => {
            const end = Date.now();
            socket.destroy();

            resolve({
                host,
                port,
                responseTime: end - start,
                success: true
            });
        });

        socket.on("error", () => {
            socket.destroy();
            resolve({
                host,
                port,
                responseTime: null,
                success: false
            });
        });

        socket.on("timeout", () => {
            socket.destroy();
            resolve({
                host,
                port,
                responseTime: null,
                success: false
            });
        });
    });
}

module.exports = tcpCheck;
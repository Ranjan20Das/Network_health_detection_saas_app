import { useEffect, useState } from "react";

const Dashboard = () => {
    const [regions, setRegions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLatestHealth = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/health");
            const data = await res.json();

            console.log("Latest Health Data:", data);

            setRegions(Array.isArray(data) ? data : []);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching health:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLatestHealth();

        const interval = setInterval(() => {
            fetchLatestHealth();
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    const getStatusStyle = (status) => {
        if (status === "healthy")
            return "bg-green-500 text-white";
        if (status === "warning")
            return "bg-yellow-500 text-white";
        if (status === "critical")
            return "bg-red-500 text-white";
        return "bg-gray-400 text-white";
    };

    if (loading) {
        return (
            <div className="text-center mt-20 text-xl font-semibold">
                Loading region status...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-3xl font-bold text-center mb-10">
                🌍 Network Dashboard
            </h1>

            {regions.length === 0 ? (
                <p className="text-center text-gray-600">
                    No health data available
                </p>
            ) : (
                <div className="grid md:grid-cols-3 gap-6">
                    {regions.map(($region) => (
                        <div
                            key={$region._id}
                            className="bg-white rounded-xl shadow-lg p-6 hover:scale-105 transition duration-300"
                        >
                            <h2 className="text-xl font-bold capitalize mb-3">
                                {$region.region}
                            </h2>

                            <div
                                className={`py-2 text-center rounded-full mb-4 ${getStatusStyle(
                                    $region.status
                                )}`}
                            >
                                {$region.status?.toUpperCase() || "UNKNOWN"}
                            </div>

                            <p>Ping: {$region.ping?.time ?? 0} ms</p>
                            <p>HTTP: {$region.http?.responseTime ?? 0} ms</p>
                            <p>DNS: {$region.dns?.resolveTime ?? 0} ms</p>
                            <p>
                                TCP: {region.tcp?.success ? "Success" : "Failed"}
                            </p>

                            <p className="text-sm text-gray-500 mt-3">
                                Updated:{" "}
                                {region.timestamp
                                    ? new Date(region.timestamp).toLocaleTimeString()
                                    : "N/A"}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
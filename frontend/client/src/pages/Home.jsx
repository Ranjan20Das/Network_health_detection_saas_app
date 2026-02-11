import React from "react";
import { Typewriter } from "react-simple-typewriter";
import { motion } from "framer-motion";
import networkImage from "../assets/image.png";

const features = [
    {
        title: "Real-time Monitoring",
        description: "Keep track of your network health across multiple regions instantly.",
    },
    {
        title: "Analytics & Insights",
        description: "Visualize ping, HTTP, DNS, and TCP data in beautiful charts.",
    },
    {
        title: "Easy Region Management",
        description: "Add or remove regions with a simple interface.",
    },
    {
        title: "Alert System",
        description: "Get instant alerts for critical network issues.",
    },
];

const Home = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="flex flex-col md:flex-row items-center max-w-7xl mx-auto p-6 md:py-16">
                <div className="md:w-1/2 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-bold text-blue-600">
                        Network Health Monitoring SaaS
                    </h1>

                    {/* Typewriter Animation */}
                    <h2 className="mt-4 text-gray-700 text-lg">
                        <Typewriter
                            words={[
                                "Monitor your network performance",
                                "across multiple regions",
                                "Stay ahead with alerts, analytics, and management",
                            ]}
                            loop={true}
                            cursor
                            cursorStyle="|"
                            typeSpeed={60}
                            deleteSpeed={30}
                            delaySpeed={1500}
                        />
                    </h2>
                </div>

                <div className="md:w-1/2 mt-6 md:mt-0 flex justify-center">
                    <img
                        src={networkImage}
                        alt="Network Monitoring"
                        className="rounded-lg shadow-lg w-full max-w-md"
                    />
                </div>
            </section>

            {/* Feature Cards with Animation */}
            <section className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {features.map((feature, idx) => (
                    <motion.div
                        key={idx}
                        className="bg-white p-6 rounded-2xl shadow-lg transform transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:bg-green-400 hover:border-2"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.2 }}
                    >
                        <h2 className="text-xl font-semibold text-blue-600">{feature.title}</h2>
                        <p className="mt-2 text-gray-600 text-sm">{feature.description}</p>
                    </motion.div>
                ))}
            </section>
        </div>
    );
};

export default Home;
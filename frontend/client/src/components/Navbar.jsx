import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <nav className="bg-blue-600 text-white p-4 shadow-md">
            <div className="max-w-7xl mx-auto flex justify-center items-center space-x-6">
                {/* Navbar Links */}
                <Link
                    to="/"
                    className="px-3 py-2 rounded hover:bg-blue-500 transition duration-200"
                >
                    Home
                </Link>
                <Link
                    to="/login"
                    className="px-3 py-2 rounded hover:bg-blue-500 transition duration-200"
                >
                    Login
                </Link>
                <Link
                    to="/dashboard"
                    className="px-3 py-2 rounded hover:bg-blue-500 transition duration-200"
                >
                    Dashboard
                </Link>
                <Link
                    to="/regions"
                    className="px-3 py-2 rounded hover:bg-blue-500 transition duration-200"
                >
                    Regions
                </Link>
                <Link
                    to="/analytics"
                    className="px-3 py-2 rounded hover:bg-blue-500 transition duration-200"
                >
                    Analytics
                </Link>

                {/* Logout Button */}
                <div className="ml-auto" />
                <button
                    onClick={handleLogout}
                    className="px-3 py-2 rounded bg-red-500 hover:bg-yellow-600 transition duration-200"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
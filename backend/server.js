require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
const regionRoutes = require("./routes/regionRoutes");
const healthRoutes = require("./routes/healthRoutes");
const authRoutes = require("./routes/authRoutes");


// Connect Database
connectDB();

// Middleware
app.use(express.json());
app.use("/api/health", healthRoutes);
app.use(cors({

    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use("/api/regions", regionRoutes);
app.use("/api/auth", authRoutes);

// Test Route
app.get("/", (req, res) => {
    res.send("Backend API Running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
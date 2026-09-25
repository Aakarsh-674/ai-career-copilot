import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import mockTestRoutes from "./routes/mockTestRoutes.js";

dotenv.config();

connectDB();

const app = express();

app.use(cors());

app.use("/api/user", userRoutes);

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/resume", resumeRoutes);

app.use("/api/jobs", jobRoutes);

app.use("/api/mock-tests", mockTestRoutes);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("AI Career Copilot API is running");
});

app.get("/api/test", (req, res) => {
    res.json({
        message: "Frontend connected to backend successfully"
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
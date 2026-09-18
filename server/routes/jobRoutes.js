import express from "express";
import Job from "../models/Job.js";
import Resume from "../models/Resume.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { normalizeSkill } from "../utils/skillNormalizer.js";

const router = express.Router();

// Add a job
router.post("/", async (req, res) => {
    try {
        const job = await Job.create(req.body);

        res.status(201).json({
            message: "Job created successfully",
            job
        });

    } catch (error) {
        console.error("Error creating job:", error);

        res.status(500).json({
            message: "Failed to create job"
        });
    }
});

// Get all jobs
router.get("/", async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 });

        res.json({
            jobs
        });

    } catch (error) {
        console.error("Error fetching jobs:", error);

        res.status(500).json({
            message: "Failed to fetch jobs"
        });
    }
});

// Get jobs matching user's resume skills
router.get("/matches", authMiddleware, async (req, res) => {
    try {
        // Get user's latest resume
        const resume = await Resume.findOne({
            user: req.user.id
        }).sort({ createdAt: -1 });

        if (!resume || !resume.analysis) {
            return res.status(404).json({
                message: "Resume has not been analyzed yet"
            });
        }

        // Get skills from resume analysis
        const resumeSkills = resume.analysis.skills.map(skill =>
    normalizeSkill(skill)
);

        // Get all jobs
        const jobs = await Job.find();

        // Calculate match percentage for every job
        const matchedJobs = jobs.map(job => {

            const jobSkills = job.skills.map(skill =>
    normalizeSkill(skill)
);

            const matchingSkills = jobSkills.filter(skill =>
                resumeSkills.includes(skill)
            );

            const matchPercentage =
                Math.round(
                    (matchingSkills.length / jobSkills.length) * 100
                );

            return {
                ...job.toObject(),
                matchingSkills,
                matchPercentage
            };
        });

        // Highest matching jobs first
        matchedJobs.sort(
            (a, b) => b.matchPercentage - a.matchPercentage
        );

        res.json({
            jobs: matchedJobs
        });

    } catch (error) {
        console.error("Error matching jobs:", error);

        res.status(500).json({
            message: "Failed to match jobs"
        });
    }
});

export default router;
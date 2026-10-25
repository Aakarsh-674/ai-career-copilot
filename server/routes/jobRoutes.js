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
        // Get the user's latest analyzed resume
        const resume = await Resume.findOne({
            user: req.user.id
        }).sort({ createdAt: -1 });

        if (!resume || !resume.analysis || !resume.analysis.skills?.length) {
            return res.status(404).json({
                message: "Please upload and analyze your resume first."
            });
        }

        // Normalize the user's resume skills
        const resumeSkills = resume.analysis.skills.map(skill =>
            normalizeSkill(skill)
        );

        // Fetch real remote jobs from Himalayas
        const response = await fetch(
            "https://himalayas.app/jobs/api?limit=20",
            {
                signal: AbortSignal.timeout(15000)
            }
        );

        if (!response.ok) {
            throw new Error(`Himalayas API returned ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data.jobs)) {
            throw new Error("Unexpected response from Himalayas API");
        }
        // Match resume skills against the job listing text.
        // The API does not provide a dedicated skills array.
        const matchedJobs = data.jobs.map(job => {
            const searchableText = [
                job.title,
                job.excerpt,
                job.description,
                ...(job.categories || []),
                ...(job.parentCategories || [])
            ]
                .filter(Boolean)
                .join(" ")
                .replace(/<[^>]*>/g, " ")
                .toLowerCase();

            // Normalize the listing text into searchable words.
            const normalizedJobText = searchableText
                .replace(/[^a-z0-9+#.]/g, " ")
                .replace(/\s+/g, " ")
                .trim();

            // Match each resume skill using its normalized name.
            const matchingSkills = [
                ...new Set(
                    resume.analysis.skills.filter(skill => {
                        const normalizedSkill = normalizeSkill(skill);

                        if (!normalizedSkill) {
                            return false;
                        }

                        // Handle short or symbolic skills safely.
                        const skillPatterns = {
                            cpp: /\bc\+\+\b|\bcpp\b/i,
                            csharp: /\bc#\b|\bc sharp\b/i,
                            c: /(?:^|[^a-z0-9+#])c(?:$|[^a-z0-9+#])/i,
                            javascript: /\bjavascript\b|\bjava script\b/i,
                            typescript: /\btypescript\b|\btype script\b/i,
                            react: /\breact(?:\.js|js)?\b/i,
                            nodejs: /\bnode(?:\.js|js)?\b/i,
                            express: /\bexpress(?:\.js|js)?\b/i,
                            mongodb: /\bmongodb\b|\bmongo db\b|\bmongo\b/i,
                            postgresql: /\bpostgresql\b|\bpostgres\b|\bpostgre sql\b/i,
                            nextjs: /\bnext(?:\.js|js)\b/i,
                            tailwind: /\btailwind(?:\s*css|css)?\b/i
                        };

                        const pattern = skillPatterns[normalizedSkill];

                        if (pattern) {
                            return pattern.test(searchableText);
                        }

                        // Use word boundaries for other skills to avoid
                        // matching a skill inside an unrelated word.
                        const escapedSkill = normalizedSkill.replace(
                            /[.*+?^${}()|[\]\\]/g,
                            "\\$&"
                        );

                        const patternForSkill = new RegExp(
                            `(?:^|[^a-z0-9])${escapedSkill}(?:$|[^a-z0-9])`,
                            "i"
                        );

                        return patternForSkill.test(normalizedJobText);
                    })
                )
            ];

            const normalizedResumeSkills = [
                ...new Set(
                    resumeSkills.filter(Boolean)
                )
            ];

            const matchPercentage = normalizedResumeSkills.length
                ? Math.round(
                    (
                        new Set(
                            matchingSkills.map(normalizeSkill)
                        ).size / normalizedResumeSkills.length
                    ) * 100
                )
                : 0;

            return {
                _id: job.guid,
                title: job.title,
                company: job.companyName,
                location: "Remote",
                description: job.excerpt || "",
                skills: job.categories || [],
                matchingSkills,
                matchPercentage,

                // Preserve the official application URL exactly as provided.
                applyLink: job.applicationLink,

                // Required source attribution for Himalayas listings.
                source: "Himalayas",
                sourceLink: "https://himalayas.app"
            };
        });


        matchedJobs.sort(
            (a, b) => b.matchPercentage - a.matchPercentage
        );

        res.json({
            jobs: matchedJobs,
            source: "Himalayas",
            sourceLink: "https://himalayas.app"
        });
    } catch (error) {
        console.error("Error matching remote jobs:", error);

        res.status(502).json({
            message: "Unable to fetch remote jobs right now. Please try again later."
        });
    }
});

export default router;
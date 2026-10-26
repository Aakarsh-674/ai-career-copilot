import express from "express";
import multer from "multer";
import authMiddleware from "../middleware/authMiddleware.js";
import { extractPdfText } from "../utils/resumeParser.js";
import Resume from "../models/Resume.js";
import { analyzeResume } from "../utils/aiAnalyzer.js";

const router = express.Router();

const upload = multer({
    dest: "uploads/",
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {

        const allowedTypes = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only PDF and DOCX files are allowed"));
        }
    }
});

router.post(
    "/upload",
    authMiddleware,
    upload.single("resume"),
    async (req, res) => {

        try {

            console.log("Uploaded file:", req.file);

            const extractedText = await extractPdfText(
                req.file.path
            );
            const resume = await Resume.create({
                user: req.user.id,
                fileName: req.file.originalname,
                filePath: req.file.path,
                extractedText: extractedText
            });

            console.log("Resume saved to MongoDB:", resume._id);

            res.json({
                message: "Resume uploaded and saved successfully",
                resumeId: resume._id
            });

        } catch (error) {

            console.error("Resume processing error:", error);

            res.status(500).json({
                message: "Failed to process resume"
            });
        }
    }
);

router.get(
    "/",
    authMiddleware,
    async (req, res) => {
        try {

            const resume = await Resume.findOne({
                user: req.user.id
            }).sort({ createdAt: -1 });

            if (!resume) {
                return res.status(404).json({
                    message: "No resume found"
                });
            }

            res.json({
                resume
            });

        } catch (error) {

            console.error("Error fetching resume:", error);

            res.status(500).json({
                message: "Failed to fetch resume"
            });
        }
    }
);


router.get(
    "/analyze",
    authMiddleware,
    async (req, res) => {
        try {
            // Get the latest resume for the logged-in user
            const resume = await Resume.findOne({
                user: req.user.id
            }).sort({ createdAt: -1 });

            if (!resume) {
                return res.status(404).json({
                    message: "No resume found. Please upload a resume first."
                });
            }

            if (!resume.extractedText?.trim()) {
                return res.status(400).json({
                    message: "No readable text found in the resume."
                });
            }

            // Analyze the resume using Gemini
            const analysis = await analyzeResume(resume.extractedText);

            // aiAnalyzer.js validates the JSON and returns a JSON string
            const parsedAnalysis = JSON.parse(analysis);

            // Save the analysis in MongoDB
            resume.analysis = parsedAnalysis;
            await resume.save();

            return res.json({
                message: "Resume analyzed successfully",
                analysis: parsedAnalysis
            });

        } catch (error) {
            console.error("AI analysis error:", error.message);

            const status = error.status ?? error.code;

            if (
                status === 503 ||
                status === 500 ||
                status === 502 ||
                status === 504 ||
                error.message?.includes("UNAVAILABLE")
            ) {
                return res.status(503).json({
                    message: "The AI service is temporarily busy. Please try again in a minute."
                });
            }

            if (
                error.message?.includes("JSON") ||
                error.message?.includes("invalid resume analysis structure")
            ) {
                return res.status(502).json({
                    message: "The AI returned an invalid analysis. Please try again."
                });
            }

            return res.status(500).json({
                message: "Failed to analyze resume. Please try again."
            });
        }
    }
);


router.get(
    "/analysis",
    authMiddleware,
    async (req, res) => {
        try {
            const resume = await Resume.findOne({
                user: req.user.id
            }).sort({ createdAt: -1 });

            if (!resume) {
                return res.status(404).json({
                    message: "No resume found"
                });
            }

            if (!resume.analysis) {
                return res.status(404).json({
                    message: "Resume has not been analyzed yet"
                });
            }

            res.json({
                analysis: resume.analysis
            });

        } catch (error) {
            console.error("Error fetching analysis:", error);

            res.status(500).json({
                message: "Failed to fetch resume analysis"
            });
        }
    }
);

export default router;
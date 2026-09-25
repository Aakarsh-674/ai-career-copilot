import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import MockTest from "../models/MockTest.js";
import { generateMockTest } from "../utils/mockTestGenerator.js";

const router = express.Router();


// Generate a mock test
router.post("/generate", authMiddleware, async (req, res) => {
    try {
        const {
            topic,
            difficulty,
            numberOfQuestions
        } = req.body;

        if (!topic || !difficulty || !numberOfQuestions) {
            return res.status(400).json({
                message: "Topic, difficulty and number of questions are required"
            });
        }

        if (!["Easy", "Medium", "Hard"].includes(difficulty)) {
            return res.status(400).json({
                message: "Invalid difficulty"
            });
        }

        if (numberOfQuestions < 1 || numberOfQuestions > 20) {
            return res.status(400).json({
                message: "Number of questions must be between 1 and 20"
            });
        }

        const test = await generateMockTest(
            topic,
            difficulty,
            numberOfQuestions
        );

        const mockTest = await MockTest.create({
            user: req.user.id,
            topic,
            difficulty,
            questions: test.questions,
            totalQuestions: test.questions.length
        });

        res.status(201).json({
            message: "Mock test generated successfully",
            test: mockTest
        });

    } catch (error) {
        console.error("Error generating mock test:", error);

        res.status(500).json({
            message: "Failed to generate mock test"
        });
    }
});

// Get a mock test for attempting
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const test = await MockTest.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!test) {
            return res.status(404).json({
                message: "Mock test not found"
            });
        }

        const questionsWithoutAnswers = test.questions.map(
            (question, index) => ({
                questionNumber: index + 1,
                question: question.question,
                options: question.options
            })
        );

        res.json({
            test: {
                _id: test._id,
                topic: test.topic,
                difficulty: test.difficulty,
                totalQuestions: test.totalQuestions,
                questions: questionsWithoutAnswers
            }
        });

    } catch (error) {
        console.error("Error fetching mock test:", error);

        res.status(500).json({
            message: "Failed to fetch mock test"
        });
    }
});
// Submit a mock test
router.post("/:id/submit", authMiddleware, async (req, res) => {
    try {
        const { answers } = req.body;

        if (!answers || !Array.isArray(answers)) {
            return res.status(400).json({
                message: "Answers must be an array"
            });
        }

        const test = await MockTest.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!test) {
            return res.status(404).json({
                message: "Mock test not found"
            });
        }

        let score = 0;

        const results = test.questions.map((question, index) => {
            const userAnswer = answers[index];

            const isCorrect =
                userAnswer === question.correctAnswer;

            if (isCorrect) {
                score++;
            }

            return {
                questionNumber: index + 1,
                question: question.question,
                userAnswer: userAnswer || null,
                correctAnswer: question.correctAnswer,
                isCorrect,
                explanation: question.explanation
            };
        });

        test.score = score;
        await test.save();

        res.json({
            message: "Test submitted successfully",
            score,
            totalQuestions: test.totalQuestions,
            percentage: Math.round(
                (score / test.totalQuestions) * 100
            ),
            results
        });

    } catch (error) {
        console.error("Error submitting mock test:", error);

        res.status(500).json({
            message: "Failed to submit mock test"
        });
    }
});
// Get user's mock test history
router.get("/history", authMiddleware, async (req, res) => {
    try {
        const tests = await MockTest.find({
            user: req.user.id
        }).sort({ createdAt: -1 });

        res.json({
            tests
        });

    } catch (error) {
        console.error("Error fetching mock test history:", error);

        res.status(500).json({
            message: "Failed to fetch mock test history"
        });
    }
});


export default router;
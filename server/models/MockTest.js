import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: true
        },
        options: {
            type: [String],
            required: true
        },
        correctAnswer: {
            type: String,
            required: true
        },
        explanation: {
            type: String,
            required: true
        }
    },
    { _id: false }
);

const mockTestSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        topic: {
            type: String,
            required: true
        },

        difficulty: {
            type: String,
            required: true,
            enum: ["Easy", "Medium", "Hard"]
        },

        questions: {
            type: [questionSchema],
            required: true
        },

        score: {
            type: Number,
            default: null
        },

        userAnswers: {
            type: [String],
            default: []
        },

        totalQuestions: {
            type: Number,
            required: true
        }
    },
    { timestamps: true }
);

const MockTest = mongoose.model("MockTest", mockTestSchema);

export default MockTest;
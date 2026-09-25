import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

export const generateMockTest = async (
    topic,
    difficulty,
    numberOfQuestions
) => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",

        contents: `
You are an expert technical interviewer and exam question creator.

Create a multiple-choice mock test.

Topic: ${topic}
Difficulty: ${difficulty}
Number of questions: ${numberOfQuestions}

Return ONLY valid JSON.

The JSON must have exactly this structure:

{
    "questions": [
        {
            "question": "question text",
            "options": [
                "option 1",
                "option 2",
                "option 3",
                "option 4"
            ],
            "correctAnswer": "exact correct option",
            "explanation": "short explanation"
        }
    ]
}

Rules:

1. Generate exactly ${numberOfQuestions} questions.
2. Every question must have exactly 4 options.
3. There must be exactly one correct answer.
4. correctAnswer must exactly match one of the options.
5. Questions must be related to ${topic}.
6. Difficulty must be ${difficulty}.
7. Do not repeat questions.
8. Keep explanations short and educational.
9. Do not use markdown.
10. Do not use code fences.
11. Return JSON only.
        `
    });

    return JSON.parse(response.text);
};
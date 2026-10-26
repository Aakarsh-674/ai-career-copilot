
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const analyzeResume = async (resumeText) => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not configured.");
    }

    if (!resumeText || !resumeText.trim()) {
        throw new Error("Resume text is empty.");
    }

    const prompt = `
You are an AI career assistant.

Analyze the following resume and return a JSON object with exactly
these fields:

{
    "score": 75,
    "skills": ["JavaScript", "React"],
    "strengths": ["Relevant projects"],
    "weaknesses": ["Limited work experience"],
    "suggestions": ["Add measurable project achievements"]
}

Rules:
- score must be a number between 0 and 100.
- skills, strengths, weaknesses, and suggestions must be arrays of strings.
- Return valid JSON only, without Markdown or code fences.
- Base the analysis only on the resume provided.

Resume:
${resumeText}
`;

    const maxAttempts = 3;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json"
                }
            });

            const text = response.text;

            if (!text || !text.trim()) {
                throw new Error("Gemini returned an empty response.");
            }

            // Validate the JSON before returning it to the route.
            const parsed = JSON.parse(text);

            if (
                typeof parsed.score !== "number" ||
                !Array.isArray(parsed.skills) ||
                !Array.isArray(parsed.strengths) ||
                !Array.isArray(parsed.weaknesses) ||
                !Array.isArray(parsed.suggestions)
            ) {
                throw new Error("Gemini returned an invalid resume analysis structure.");
            }

            return JSON.stringify(parsed);
        } catch (error) {
            const status = error.status ?? error.code;
            const retryable =
                status === 503 ||
                status === 500 ||
                status === 502 ||
                status === 504 ||
                error.message?.includes("UNAVAILABLE");

            if (!retryable || attempt === maxAttempts) {
                console.error(
                    `Resume analysis failed on attempt ${attempt}:`,
                    error.message
                );

                throw error;
            }

            // Wait 1 second, then 2 seconds before retrying.
            await sleep(attempt * 1000);
        }
    }

    throw new Error("Resume analysis failed after multiple attempts.");
};

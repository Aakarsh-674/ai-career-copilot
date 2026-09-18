import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

export const analyzeResume = async (resumeText) => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
You are an AI career assistant.

Analyze the following resume and return ONLY valid JSON.

The JSON must have exactly these fields:

{
    "score": number,
    "skills": [],
    "strengths": [],
    "weaknesses": [],
    "suggestions": []
}

Rules:
- score must be a number between 0 and 100.
- skills must be an array of strings.
- strengths must be an array of strings.
- weaknesses must be an array of strings.
- suggestions must be an array of strings.
- Do not include markdown.
- Do not include \`\`\`json.
- Return JSON only.

Resume:

${resumeText}
        `
    });

    return response.text;
};

const skillAliases = {
    "react.js": "react",
    "reactjs": "react",
    "react js": "react",

    "node.js": "nodejs",
    "nodejs": "nodejs",
    "node js": "nodejs",

    "express.js": "express",
    "expressjs": "express",
    "express js": "express",

    "mongodb": "mongodb",
    "mongo db": "mongodb",
    "mongo": "mongodb",

    "javascript": "javascript",
    "java script": "javascript",
    "js": "javascript",

    "typescript": "typescript",
    "type script": "typescript",
    "ts": "typescript",

    "postgresql": "postgresql",
    "postgres": "postgresql",
    "postgre sql": "postgresql",

    "c++": "cpp",
    "cpp": "cpp",

    "c#": "csharp",
    "c sharp": "csharp",

    "next.js": "nextjs",
    "nextjs": "nextjs",

    "tailwind css": "tailwind",
    "tailwindcss": "tailwind"
};

export const normalizeSkill = (skill) => {
    if (typeof skill !== "string" || !skill.trim()) {
        return "";
    }

    const cleanedSkill = skill
        .toLowerCase()
        .trim()
        .replace(/\s+/g, " ");

    if (skillAliases[cleanedSkill]) {
        return skillAliases[cleanedSkill];
    }

    return cleanedSkill
        .replace(/\./g, "")
        .replace(/\s+/g, "");
};

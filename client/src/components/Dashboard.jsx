import { useEffect, useState } from "react";
import api from "../api/axios";
import StatCard from "./StatCard";
import "./Dashboard.css";

function Dashboard() {

    const [user, setUser] = useState(null);
    
    const [resumeScore, setResumeScore] = useState(null);

    const [skillsCount, setSkillsCount] = useState(null);

    const [jobMatches, setJobMatches] = useState(null);



    const getProfile = async () => {
        try {
            const response = await api.get("/api/user/profile");

            setUser(response.data.user);

        } catch (error) {
            console.error(error);
        }
    };

const getResumeScore = async () => {
    try {
        const response = await api.get("/api/resume/analysis");

        const analysis = response.data.analysis;

        setResumeScore(analysis.score);
        setSkillsCount(analysis.skills.length);

    } catch (error) {
        console.error("Error fetching resume analysis:", error);
    }
};

const getJobMatches = async () => {
    try {
        const response = await api.get("/api/jobs/matches");

        setJobMatches(response.data.jobs.length);

    } catch (error) {
        console.error("Error fetching job matches:", error);
    }
};


    useEffect(() => {
        getProfile();
        getResumeScore();
        getJobMatches();
    }, []);

    return (
        <div className="dashboard">

            <div className="dashboard-header">

                <h1>Dashboard</h1>

                {user && (
                    <p>
                        Welcome back, {user.name}! 👋
                    </p>
                )}

            </div>

            <div className="stats-container">

                <StatCard
                    title="Resume Score"
                    value={resumeScore !== null ? `${resumeScore}/100` : "--"}
                />

                <StatCard
                    title="Skills"
                    value={skillsCount !== null ? skillsCount : "--"}
                />

                <StatCard
                    title="Job Matches"
                    value={jobMatches !== null ? jobMatches : "--"}
                />

            </div>

            <div className="ai-section">

                <h2>🤖 AI Career Assistant</h2>

                <p>
                    Your personalized AI career assistant
                    will appear here.
                </p>

            </div>

        </div>
    );
}

export default Dashboard;
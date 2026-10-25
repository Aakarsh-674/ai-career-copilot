
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import "./Dashboard.css";

function Dashboard() {
    const [user, setUser] = useState(null);
    const [resumeScore, setResumeScore] = useState(null);
    const [skillsCount, setSkillsCount] = useState(null);
    const [jobMatches, setJobMatches] = useState(null);

    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState([]);

    const loadDashboard = useCallback(async () => {
        setLoading(true);
        setErrors([]);

        const results = await Promise.allSettled([
            api.get("/api/user/profile"),
            api.get("/api/resume/analysis"),
            api.get("/api/jobs/matches"),
        ]);

        const newErrors = [];

        if (results[0].status === "fulfilled") {
            setUser(results[0].value.data.user ?? null);
        } else {
            console.error("Error fetching profile:", results[0].reason);
            newErrors.push("profile");
        }

        if (results[1].status === "fulfilled") {
            const analysis = results[1].value.data.analysis;

            setResumeScore(analysis?.score ?? null);
            setSkillsCount(
                Array.isArray(analysis?.skills)
                    ? analysis.skills.length
                    : analysis
                    ? 0
                    : null
            );
        } else {
            console.error("Error fetching resume analysis:", results[1].reason);
            newErrors.push("resume");
        }

        if (results[2].status === "fulfilled") {
            const jobs = results[2].value.data.jobs;

            setJobMatches(
                Array.isArray(jobs) ? jobs.length : null
            );
        } else {
            console.error("Error fetching job matches:", results[2].reason);
            newErrors.push("jobs");
        }

        setErrors(newErrors);
        setLoading(false);
    }, []);

    useEffect(() => {
        loadDashboard();
    }, [loadDashboard]);

    const firstName = user?.name?.trim().split(/\s+/)[0];

    const stats = [
        {
            title: "Resume Score",
            value: resumeScore !== null ? `${resumeScore}/100` : "—",
            icon: "📄",
            description:
                resumeScore === null
                    ? "Analyze your resume to get a score"
                    : "Your latest AI evaluation",
            color: "resume",
            link: "/resume",
        },
        {
            title: "Skills Identified",
            value: skillsCount !== null ? skillsCount : "—",
            icon: "⚡",
            description: "Skills found in your resume",
            color: "skills",
            link: "/resume",
        },
        {
            title: "Job Matches",
            value: jobMatches !== null ? jobMatches : "—",
            icon: "💼",
            description: "Matches in your career profile",
            color: "jobs",
            link: "/jobs",
        },
    ];

    const actions = [
        {
            title: "Resume Analyzer",
            description:
                "Understand your strengths, identify gaps, and improve your resume with AI feedback.",
            icon: "📄",
            color: "resume",
            label: "Analyze Resume",
            link: "/resume",
        },
        {
            title: "Job Matching",
            description:
                "Explore relevant job opportunities based on your skills and career profile.",
            icon: "💼",
            color: "jobs",
            label: "Explore Jobs",
            link: "/jobs",
        },
        {
            title: "AI Mock Tests",
            description:
                "Practice technical questions, test your knowledge, and learn from your mistakes.",
            icon: "🎯",
            color: "tests",
            label: "Start Practicing",
            link: "/mock-tests",
        },
    ];

    return (
        <main className="dashboard">
            <div className="dashboard-container">
                <section className="dashboard-header">
                    <div className="dashboard-header-content">
                        <span className="dashboard-eyebrow">
                            YOUR CAREER WORKSPACE
                        </span>

                        <h1>
                            {firstName
                                ? `Welcome back, ${firstName}!`
                                : "Welcome to your Dashboard"}
                        </h1>

                        <p>
                            Every step counts. Track your progress and keep
                            moving toward your career goals.
                        </p>

                        <Link
                            to="/resume"
                            className="dashboard-primary-link"
                        >
                            Improve My Resume <span>→</span>
                        </Link>
                    </div>

                    <div
                        className="dashboard-hero-illustration"
                        aria-hidden="true"
                    >
                        <div className="dashboard-hero-orbit">
                            <span>✦</span>
                            <div className="dashboard-hero-rocket">🚀</div>
                            <span>✧</span>
                        </div>
                        <div className="dashboard-hero-caption">
                            Your next opportunity starts here.
                        </div>
                    </div>
                </section>

                {errors.length > 0 && (
                    <div className="dashboard-error" role="alert">
                        <div>
                            <strong>Some information couldn't be loaded.</strong>
                            <p>
                                Check your connection and try refreshing the
                                dashboard.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={loadDashboard}
                            disabled={loading}
                        >
                            {loading ? "Refreshing..." : "Retry"}
                        </button>
                    </div>
                )}

                <section className="dashboard-stats-section">
                    <div className="dashboard-section-heading">
                        <div>
                            <span className="dashboard-section-eyebrow">
                                YOUR PROGRESS
                            </span>
                            <h2>Your Overview</h2>
                            <p>See where you stand in your career preparation.</p>
                        </div>

                        <button
                            type="button"
                            className="dashboard-refresh-button"
                            onClick={loadDashboard}
                            disabled={loading}
                            aria-label="Refresh dashboard statistics"
                        >
                            <span className={loading ? "dashboard-refreshing" : ""}>
                                ↻
                            </span>
                            Refresh
                        </button>
                    </div>

                    <div className="dashboard-stats-grid">
                        {stats.map((stat) => (
                            <Link
                                to={stat.link}
                                className="dashboard-stat-card"
                                key={stat.title}
                            >
                                <div className="dashboard-stat-top">
                                    <span
                                        className={`dashboard-stat-icon dashboard-${stat.color}-icon`}
                                    >
                                        {stat.icon}
                                    </span>

                                    <span className="dashboard-stat-arrow">
                                        ↗
                                    </span>
                                </div>

                                <span className="dashboard-stat-title">
                                    {stat.title}
                                </span>

                                <strong className="dashboard-stat-value">
                                    {loading && stat.value === "—"
                                        ? "..."
                                        : stat.value}
                                </strong>

                                <span className="dashboard-stat-description">
                                    {stat.description}
                                </span>
                            </Link>
                        ))}
                    </div>
                </section>

                <section className="dashboard-actions-section">
                    <div className="dashboard-section-heading">
                        <div>
                            <span className="dashboard-section-eyebrow">
                                TAKE ACTION
                            </span>
                            <h2>Continue Your Journey</h2>
                            <p>Choose a tool and make progress today.</p>
                        </div>
                    </div>

                    <div className="dashboard-actions-grid">
                        {actions.map((action, index) => (
                            <article
                                className="dashboard-action-card"
                                key={action.title}
                            >
                                <div className="dashboard-action-top">
                                    <div
                                        className={`dashboard-action-icon dashboard-${action.color}-icon`}
                                    >
                                        {action.icon}
                                    </div>

                                    <span className="dashboard-action-number">
                                        0{index + 1}
                                    </span>
                                </div>

                                <h3>{action.title}</h3>

                                <p>{action.description}</p>

                                <Link
                                    to={action.link}
                                    className="dashboard-action-link"
                                >
                                    {action.label} <span>→</span>
                                </Link>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="dashboard-bottom-section">
                    <div className="dashboard-bottom-icon">📈</div>

                    <div className="dashboard-bottom-content">
                        <h2>Learn from every attempt</h2>
                        <p>
                            Review previous mock tests, understand your
                            mistakes, and keep improving your performance.
                        </p>
                    </div>

                    <Link
                        to="/mock-test-history"
                        className="dashboard-history-link"
                    >
                        View Test History <span>→</span>
                    </Link>
                </section>

                <footer className="dashboard-footer">
                    Small improvements today can lead to bigger opportunities
                    tomorrow.
                </footer>
            </div>
        </main>
    );
}

export default Dashboard;

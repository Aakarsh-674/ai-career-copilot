
import { useCallback, useEffect, useState } from "react";
import api from "../api/axios";
import "./Jobs.css";

function getValidApplyUrl(value) {
    if (typeof value !== "string" || !value.trim()) {
        return null;
    }

    try {
        const url = new URL(value.trim());

        // Only allow regular web application links.
        if (url.protocol !== "https:" && url.protocol !== "http:") {
            return null;
        }

        return url.href;
    } catch {
        return null;
    }
}

function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const getJobs = useCallback(async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const response = await api.get("/api/jobs/matches");
            console.log("Jobs returned by backend:", response.data.jobs);

response.data.jobs.forEach((job) => {
    console.log("Job:", job.title);
    console.log("Company:", job.company);
    console.log("Apply URL:", job.applyLink);
});
            //console.log("Complete API response:", response.data);
            //console.log("First job:", response.data.jobs?.[0]);
            //console.log("First job application URL:", response.data.jobs?.[0]?.applyLink);
            const receivedJobs = Array.isArray(response.data.jobs)
                ? response.data.jobs
                : [];

            // Debug information: check the real URLs returned by the backend.
            console.table(
                receivedJobs.map((job) => ({
                    id: job._id,
                    title: job.title,
                    company: job.company,
                    applyLink: job.applyLink,
                    validApplyUrl: Boolean(getValidApplyUrl(job.applyLink)),
                }))
            );

            setJobs(receivedJobs);
        } catch (err) {
            console.error("Error fetching job matches:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load job matches. Please try again."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        getJobs();
    }, [getJobs]);

    if (loading) {
        return (
            <main className="jobs-page">
                <div className="jobs-container jobs-state-card">
                    <div className="jobs-spinner" />
                    <h2>Finding your job matches...</h2>
                    <p>Loading opportunities based on your resume.</p>
                </div>
            </main>
        );
    }

    if (error && jobs.length === 0) {
        return (
            <main className="jobs-page">
                <div className="jobs-container">
                    <header className="jobs-page-header">
                        <span className="jobs-eyebrow">
                            CAREER OPPORTUNITIES
                        </span>
                        <h1>Your Job Matches</h1>
                    </header>

                    <section className="jobs-state-card">
                        <h2>Couldn't load job matches</h2>
                        <p>{error}</p>
                        <button
                            type="button"
                            className="jobs-primary-button"
                            onClick={() => getJobs()}
                        >
                            Try Again
                        </button>
                    </section>
                </div>
            </main>
        );
    }

    return (
        <main className="jobs-page">
            <div className="jobs-container">
                <header className="jobs-page-header">
                    <div>
                        <span className="jobs-eyebrow">
                            CAREER OPPORTUNITIES
                        </span>
                        <h1>Your Next <span>Opportunity</span></h1>
<p>
    Explore roles matched to the skills in your resume.
</p>
<p className="jobs-source-attribution">
    Job listings provided by{" "}
    <a
        href="https://himalayas.app"
        target="_blank"
        rel="noopener noreferrer"
    >
        Himalayas
    </a>.
    Application links direct you to the original listing.
</p>

                    </div>

                    <button
                        type="button"
                        className="jobs-refresh-button"
                        onClick={() => getJobs(true)}
                        disabled={refreshing}
                    >
                        {refreshing ? "Refreshing..." : "↻ Refresh Matches"}
                    </button>
                </header>

                {error && (
                    <p className="jobs-inline-error">{error}</p>
                )}

                <section className="jobs-summary">
                    <div>
                        <h2>Recommended for you</h2>
                        <p>
                            Review your skill compatibility before applying.
                        </p>
                    </div>
                    <strong>
                        {jobs.length} {jobs.length === 1 ? "job" : "jobs"}
                    </strong>
                </section>

                {jobs.length === 0 ? (
                    <section className="jobs-state-card">
                        <h2>No matching jobs found</h2>
                        <p>
                            Analyze your resume to help identify suitable roles.
                        </p>
                        <a href="/resume" className="jobs-primary-button">
                            Analyze Resume →
                        </a>
                    </section>
                ) : (
                    <section className="jobs-list">
                        {jobs.map((job) => {
                            const percentage = Math.min(
                                100,
                                Math.max(0, Number(job.matchPercentage) || 0)
                            );

                            const matchingSkills = Array.isArray(job.matchingSkills)
                                ? job.matchingSkills
                                : [];

                            const applyUrl = getValidApplyUrl(job.applyLink);

                            return (
                                <article className="job-card" key={job._id}>
                                    <div className="job-card-top">
                                        <div className="job-company-avatar">
                                            {(job.company || "C")
                                                .trim()
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>

                                        <div className="job-title-block">
                                            <h2>{job.title || "Untitled role"}</h2>
                                            <p className="job-company">
                                                {job.company || "Company not specified"}
                                            </p>
                                        </div>

                                        <div className="job-match-badge">
                                            <span>SKILL MATCH</span>
                                            <strong>{percentage}%</strong>
                                        </div>
                                    </div>

                                    <div className="job-meta">
                                        <span>
                                            📍 {job.location || "Location not specified"}
                                        </span>
                                    </div>

                                    <p className="job-description">
                                        {job.description ||
                                            "No description available for this role."}
                                    </p>

                                    <div className="job-match-section">
                                        <div className="job-match-labels">
                                            <span>Resume compatibility</span>
                                            <strong>{percentage}%</strong>
                                        </div>

                                        <div
                                            className="job-match-bar"
                                            role="progressbar"
                                            aria-label={`Skill match for ${job.title || "job"}`}
                                            aria-valuenow={percentage}
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                        >
                                            <div
                                                className="job-match-fill"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="job-skills-section">
                                        <h3>Matching skills</h3>

                                        {matchingSkills.length > 0 ? (
                                            <div className="job-skill-list">
                                                {matchingSkills.map((skill, index) => (
                                                    <span
                                                        className="job-skill-badge"
                                                        key={`${skill}-${index}`}
                                                    >
                                                        ✓ {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="job-no-skills">
                                                No exact skill matches found.
                                            </p>
                                        )}
                                    </div>

                                    <div className="job-card-footer">
                                        {applyUrl ? (
                                            <a
                                                href={applyUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="job-apply-button"
                                            >
                                                Apply Now ↗
                                            </a>
                                        ) : (
                                            <div className="job-apply-unavailable">
                                                <p>
                                                    No valid application URL is
                                                    available for this job.
                                                </p>
                                                <span>
                                                    Check the backend job data.
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </article>
                            );
                        })}
                    </section>
                )}
            </div>
        </main>
    );
}

export default Jobs;
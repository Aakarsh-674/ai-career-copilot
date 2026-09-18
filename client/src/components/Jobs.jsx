import { useEffect, useState } from "react";
import api from "../api/axios";
import "./Jobs.css";

function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const getJobs = async () => {
        try {
            const response = await api.get("/api/jobs/matches");

            console.log("Matched Jobs:", response.data.jobs);

            setJobs(response.data.jobs);
        } catch (error) {
            console.error("Error fetching jobs:", error);

            setError(
                error.response?.data?.message ||
                "Failed to load job matches"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getJobs();
    }, []);

    if (loading) {
        return (
            <div className="jobs-container">
                <h1>Job Matches</h1>
                <p>Finding jobs that match your resume...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="jobs-container">
                <h1>Job Matches</h1>
                <p className="error-message">{error}</p>
            </div>
        );
    }

    return (
        <div className="jobs-container">

            <div className="jobs-header">
                <h1>Job Matches</h1>

                <p>
                    Jobs matched based on the skills found in your resume.
                </p>
            </div>

            {jobs.length === 0 ? (
                <div className="no-jobs">
                    <h2>No matching jobs found</h2>

                    <p>
                        Upload and analyze your resume to find suitable jobs.
                    </p>
                </div>
            ) : (
                <div className="jobs-list">

                    {jobs.map((job) => (

                        <div key={job._id} className="job-card">

                            <div className="job-header">

                                <div>
                                    <h2>{job.title}</h2>

                                    <p className="company">
                                        {job.company}
                                    </p>

                                    <p className="location">
                                        📍 {job.location}
                                    </p>
                                </div>

                                <div className="match-box">
                                    <span>Match</span>

                                    <strong>
                                        {job.matchPercentage}%
                                    </strong>
                                </div>

                            </div>


                            <p className="job-description">
                                {job.description}
                            </p>


                            <div className="match-section">

                                <p className="match-percentage">
                                    Skill Match: {job.matchPercentage}%
                                </p>

                                <div className="match-bar">

                                    <div
                                        className="match-fill"
                                        style={{
                                            width: `${job.matchPercentage}%`
                                        }}
                                    ></div>

                                </div>

                            </div>


                            <div className="matching-skills">

                                <p>Matching Skills:</p>

                                <div className="skill-badges">

                                    {job.matchingSkills.length > 0 ? (
                                        job.matchingSkills.map(
                                            (skill, index) => (
                                                <span
                                                    key={index}
                                                    className="skill-badge"
                                                >
                                                    {skill}
                                                </span>
                                            )
                                        )
                                    ) : (
                                        <span className="no-skills">
                                            No exact skill matches
                                        </span>
                                    )}

                                </div>

                            </div>


                            <div className="job-footer">

                                {job.applyLink ? (
                                    <a
                                        href={job.applyLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="apply-button"
                                    >
                                        Apply Now
                                    </a>
                                ) : (
                                    <span className="no-link">
                                        Application link unavailable
                                    </span>
                                )}

                            </div>

                        </div>

                    ))}

                </div>
            )}

        </div>
    );
}

export default Jobs;
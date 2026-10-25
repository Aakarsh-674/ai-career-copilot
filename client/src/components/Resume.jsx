
import { useCallback, useEffect, useState } from "react";
import api from "../api/axios";
import "./Resume.css";

function Resume() {
    const [file, setFile] = useState(null);
    const [resume, setResume] = useState(null);
    const [analysis, setAnalysis] = useState(null);

    const [loadingResume, setLoadingResume] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const getResume = useCallback(async () => {
        try {
            const response = await api.get("/api/resume");
            setResume(response.data.resume ?? null);
        } catch (err) {
            console.error("Resume fetch error:", err);
            setError(
                err.response?.data?.message ||
                "Unable to load your resume. Please try again."
            );
        } finally {
            setLoadingResume(false);
        }
    }, []);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files?.[0];

        setMessage("");
        setError("");
        setAnalysis(null);

        if (!selectedFile) {
            setFile(null);
            return;
        }

        if (selectedFile.type !== "application/pdf") {
            setFile(null);
            setError("Please select a PDF file.");
            event.target.value = "";
            return;
        }

        setFile(selectedFile);
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Please select a PDF resume first.");
            return;
        }

        setUploading(true);
        setMessage("");
        setError("");

        const formData = new FormData();
        formData.append("resume", file);

        try {
            const response = await api.post(
                "/api/resume/upload",
                formData
            );

            setMessage(
                response.data.message || "Resume uploaded successfully!"
            );
            setFile(null);

            // Clear the file input after a successful upload.
            const input = document.getElementById("resume-file-input");
            if (input) input.value = "";

            await getResume();
        } catch (err) {
            console.error("Resume upload error:", err);
            setError(
                err.response?.data?.message ||
                "Resume upload failed. Please try again."
            );
        } finally {
            setUploading(false);
        }
    };

    const handleAnalyze = async () => {
        setAnalyzing(true);
        setMessage("");
        setError("");

        try {
            const response = await api.get("/api/resume/analyze");
            const result = response.data.analysis;

            if (!result) {
                throw new Error("No analysis was returned.");
            }

            setAnalysis(result);
            setMessage("Your resume analysis is ready!");
        } catch (err) {
            console.error("Resume analysis error:", err);
            setError(
                err.response?.data?.message ||
                err.message ||
                "Unable to analyze your resume. Please try again."
            );
        } finally {
            setAnalyzing(false);
        }
    };

    useEffect(() => {
        getResume();
    }, [getResume]);

    const score = Number(analysis?.score);
    const safeScore = Number.isFinite(score)
        ? Math.min(100, Math.max(0, score))
        : 0;

    const skills = Array.isArray(analysis?.skills)
        ? analysis.skills
        : [];
    const strengths = Array.isArray(analysis?.strengths)
        ? analysis.strengths
        : [];
    const weaknesses = Array.isArray(analysis?.weaknesses)
        ? analysis.weaknesses
        : [];
    const suggestions = Array.isArray(analysis?.suggestions)
        ? analysis.suggestions
        : [];

    return (
        <main className="resume-page">
            <div className="resume-container">
                <section className="resume-heading">
                    <div>
                        <span className="resume-eyebrow">
                            CAREER DEVELOPMENT
                        </span>
                        <h1>Resume Analyzer</h1>
                        <p>
                            Upload your resume and get AI-powered feedback
                            to improve your job readiness.
                        </p>
                    </div>

                    <div className="resume-heading-icon" aria-hidden="true">
                        📄
                    </div>
                </section>

                {message && (
                    <div className="resume-alert resume-alert-success" role="status">
                        <span>✓</span> {message}
                    </div>
                )}

                {error && (
                    <div className="resume-alert resume-alert-error" role="alert">
                        <span>!</span> {error}
                        <button
                            type="button"
                            className="resume-alert-close"
                            onClick={() => setError("")}
                            aria-label="Dismiss error"
                        >
                            ×
                        </button>
                    </div>
                )}

                <section className="resume-upload-card">
                    <div className="resume-section-heading">
                        <div className="resume-section-icon">⬆</div>
                        <div>
                            <h2>Upload your resume</h2>
                            <p>Choose your latest resume in PDF format.</p>
                        </div>
                    </div>

                    <label
                        htmlFor="resume-file-input"
                        className={`resume-dropzone ${file ? "resume-dropzone-selected" : ""}`}
                    >
                        <span className="resume-upload-icon">
                            {file ? "📄" : "☁️"}
                        </span>

                        <strong>
                            {file ? file.name : "Choose a PDF file"}
                        </strong>

                        <span>
                            {file
                                ? `${(file.size / 1024).toFixed(1)} KB · Ready to upload`
                                : "Click here to browse files"}
                        </span>

                        <span className="resume-file-hint">
                            PDF format only
                        </span>

                        <input
                            id="resume-file-input"
                            type="file"
                            accept=".pdf,application/pdf"
                            onChange={handleFileChange}
                        />
                    </label>

                    <button
                        type="button"
                        className="resume-primary-button"
                        onClick={handleUpload}
                        disabled={!file || uploading}
                    >
                        {uploading ? (
                            <>
                                <span className="resume-spinner" />
                                Uploading...
                            </>
                        ) : (
                            "Upload Resume →"
                        )}
                    </button>
                </section>

                <section className="resume-current-card">
                    <div className="resume-section-heading">
                        <div className="resume-section-icon">📁</div>
                        <div>
                            <h2>Your uploaded resume</h2>
                            <p>Your latest resume available for analysis.</p>
                        </div>
                    </div>

                    {loadingResume ? (
                        <div className="resume-empty-state">
                            <span className="resume-spinner resume-spinner-dark" />
                            <p>Loading your resume...</p>
                        </div>
                    ) : resume ? (
                        <div className="resume-file-card">
                            <div className="resume-file-icon">PDF</div>

                            <div className="resume-file-details">
                                <strong>{resume.fileName || "My Resume.pdf"}</strong>
                                <span>
                                    Uploaded{" "}
                                    {resume.createdAt
                                        ? new Date(resume.createdAt).toLocaleDateString(
                                            undefined,
                                            {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            }
                                        )
                                        : "date unavailable"}
                                </span>
                            </div>

                            <span className="resume-file-status">
                                <span /> Uploaded
                            </span>
                        </div>
                    ) : (
                        <div className="resume-empty-state">
                            <span className="resume-empty-icon">📄</span>
                            <strong>No resume uploaded yet</strong>
                            <p>Upload a PDF above to get started.</p>
                        </div>
                    )}

                    <button
                        type="button"
                        className="resume-analyze-button"
                        onClick={handleAnalyze}
                        disabled={analyzing || loadingResume || !resume}
                    >
                        {analyzing ? (
                            <>
                                <span className="resume-spinner" />
                                Analyzing your resume...
                            </>
                        ) : (
                            <>✦ Analyze Resume with AI</>
                        )}
                    </button>

                    <p className="resume-analyze-hint">
                        Get insights into your skills, strengths and
                        opportunities for improvement.
                    </p>
                </section>

                {analysis && (
                    <section className="resume-analysis">
                        <div className="resume-analysis-heading">
                            <div>
                                <span className="resume-eyebrow">
                                    YOUR RESULTS
                                </span>
                                <h2>AI Resume Analysis</h2>
                                <p>
                                    Here's what the AI found in your resume.
                                </p>
                            </div>

                            <span className="resume-ai-badge">✦ AI Powered</span>
                        </div>

                        <div className="resume-score-card">
                            <div className="resume-score-info">
                                <span className="resume-score-label">
                                    OVERALL RESUME SCORE
                                </span>
                                <div className="resume-score-number">
                                    {safeScore}
                                    <span>/100</span>
                                </div>
                                <p>
                                    {safeScore >= 80
                                        ? "Great work! Keep refining your resume."
                                        : safeScore >= 60
                                        ? "Good progress. A few improvements can help."
                                        : "There is room to strengthen your resume."}
                                </p>
                            </div>

                            <div
                                className="resume-score-ring"
                                style={{
                                    "--resume-score": `${safeScore}%`,
                                }}
                                role="img"
                                aria-label={`Resume score: ${safeScore} out of 100`}
                            >
                                <div className="resume-score-ring-inner">
                                    <strong>{safeScore}</strong>
                                    <span>Score</span>
                                </div>
                            </div>
                        </div>

                        <div className="resume-analysis-section">
                            <div className="resume-subheading">
                                <h3>Skills detected</h3>
                                <span>{skills.length} skills</span>
                            </div>

                            {skills.length > 0 ? (
                                <div className="resume-skills-list">
                                    {skills.map((skill, index) => (
                                        <span
                                            className="resume-skill-badge"
                                            key={`${skill}-${index}`}
                                        >
                                            <span>✓</span> {skill}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="resume-no-data">
                                    No skills were returned in this analysis.
                                </p>
                            )}
                        </div>

                        <div className="resume-analysis-grid">
                            <article className="resume-insight-card">
                                <div className="resume-insight-heading">
                                    <span className="resume-insight-icon resume-icon-strength">
                                        ↗
                                    </span>
                                    <div>
                                        <h3>Strengths</h3>
                                        <p>What you're doing well</p>
                                    </div>
                                </div>

                                {strengths.length > 0 ? (
                                    <ul className="resume-insight-list">
                                        {strengths.map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="resume-no-data">
                                        No strengths available.
                                    </p>
                                )}
                            </article>

                            <article className="resume-insight-card">
                                <div className="resume-insight-heading">
                                    <span className="resume-insight-icon resume-icon-weakness">
                                        ↗
                                    </span>
                                    <div>
                                        <h3>Areas to improve</h3>
                                        <p>Where you can grow</p>
                                    </div>
                                </div>

                                {weaknesses.length > 0 ? (
                                    <ul className="resume-insight-list">
                                        {weaknesses.map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="resume-no-data">
                                        No improvement areas available.
                                    </p>
                                )}
                            </article>
                        </div>

                        <article className="resume-suggestions-card">
                            <div className="resume-insight-heading">
                                <span className="resume-insight-icon resume-icon-suggestion">
                                    ✦
                                </span>
                                <div>
                                    <h3>Suggestions for improvement</h3>
                                    <p>Actionable recommendations for your next update</p>
                                </div>
                            </div>

                            {suggestions.length > 0 ? (
                                <ol className="resume-suggestions-list">
                                    {suggestions.map((item, index) => (
                                        <li key={index}>
                                            <span>{index + 1}</span>
                                            <p>{item}</p>
                                        </li>
                                    ))}
                                </ol>
                            ) : (
                                <p className="resume-no-data">
                                    No suggestions available.
                                </p>
                            )}
                        </article>
                    </section>
                )}
            </div>
        </main>
    );
}

export default Resume;


import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import "./MockTestHistory.css";

const MockTestHistory = () => {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await api.get(
                    "/api/mock-tests/history"
                );

                setTests(response.data.tests);
            } catch (err) {
                console.error(
                    "Error fetching mock test history:",
                    err.response?.data || err.message
                );

                setError(
                    err.response?.data?.message ||
                    "Unable to load mock test history."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    // Identify submitted tests only.
    const completedTests = tests.filter(
        (test) =>
            test.score !== null &&
            test.score !== undefined &&
            test.totalQuestions > 0
    );

    // Calculate each completed test's percentage.
    const getPercentage = (test) =>
        Math.round(
            (test.score / test.totalQuestions) * 100
        );

    // Calculate average and best percentage.
    const averageScore =
        completedTests.length > 0
            ? Math.round(
                completedTests.reduce(
                    (total, test) => total + getPercentage(test),
                    0
                ) / completedTests.length
            )
            : 0;

    const bestScore =
        completedTests.length > 0
            ? Math.max(
                ...completedTests.map(getPercentage)
            )
            : 0;

    if (loading) {
        return (
            <div className="mock-history-page">
                <p>Loading your test history...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mock-history-page">
                <p className="history-error">{error}</p>

                <Link to="/mock-tests">
                    Back to Mock Tests
                </Link>
            </div>
        );
    }

    return (
        <div className="mock-history-page">
            {/* Page heading */}
            <div className="mock-history-header">
                <div>
                    <h1>Mock Test History</h1>
                    <p>
                        Track your practice attempts and
                        monitor your progress.
                    </p>
                </div>

                <Link
                    to="/mock-tests"
                    className="history-new-test-btn"
                >
                    + Take a New Test
                </Link>
            </div>

            {/* Statistics */}
            <div className="history-stats">
                <article className="history-stat-card">
                    <div className="history-stat-icon">
                        <span>✓</span>
                    </div>

                    <div>
                        <p>Tests Completed</p>
                        <h2>{completedTests.length}</h2>
                    </div>
                </article>

                <article className="history-stat-card">
                    <div className="history-stat-icon">
                        <span>%</span>
                    </div>

                    <div>
                        <p>Average Score</p>
                        <h2>{averageScore}%</h2>
                    </div>
                </article>

                <article className="history-stat-card">
                    <div className="history-stat-icon">
                        <span>★</span>
                    </div>

                    <div>
                        <p>Best Score</p>
                        <h2>{bestScore}%</h2>
                    </div>
                </article>
            </div>

            {/* Test history */}
            <div className="history-section-heading">
                <h2>Your Attempts</h2>
                <span>{tests.length} total</span>
            </div>

            {tests.length === 0 ? (
                <div className="history-empty">
                    <h2>No tests yet</h2>

                    <p>
                        Complete your first mock test to
                        see your results here.
                    </p>

                    <Link to="/mock-tests">
                        Start Your First Test
                    </Link>
                </div>
            ) : (
                <div className="history-list">
                    {tests.map((test) => {
                        const completed =
                            test.score !== null &&
                            test.score !== undefined;

                        const percentage =
                            completed && test.totalQuestions > 0
                                ? getPercentage(test)
                                : null;

                        return (
                            <article
                                className="history-card"
                                key={test._id}
                            >
                                <div className="history-card-main">
                                    <h2>{test.topic}</h2>

                                    <div className="history-tags">
                                        <span>
                                            {test.difficulty}
                                        </span>

                                        <span>
                                            {test.totalQuestions} questions
                                        </span>
                                    </div>

                                    <p className="history-date">
                                        Attempted:{" "}
                                        {new Date(
                                            test.createdAt
                                        ).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="history-score">
                                    {completed ? (
                                        <>
                                            <strong>
                                                {percentage}%
                                            </strong>

                                            <span>
                                                {test.score}/
                                                {test.totalQuestions} correct
                                            </span>
                                        </>
                                    ) : (
                                        <span className="history-pending">
                                            Not submitted
                                        </span>
                                    )}
                                </div>

                                {completed && (
                                    <Link
                                        to={`/mock-test-history/${test._id}/review`}
                                        className="history-review-btn"
                                    >
                                        Review Answers
                                    </Link>
                                )}
                            </article>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MockTestHistory;

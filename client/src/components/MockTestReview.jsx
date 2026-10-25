
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";
import "./MockTestReview.css";

function MockTestReview() {
    const { id } = useParams();

    const [test, setTest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchReview = async () => {
            try {
                const response = await api.get(
                    `/api/mock-tests/${id}/review`
                );

                setTest(response.data.test);
            } catch (err) {
                console.error(
                    "Error fetching test review:",
                    err.response?.data || err.message
                );

                setError(
                    err.response?.data?.message ||
                    "Unable to load this test review."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchReview();
    }, [id]);

    if (loading) {
        return (
            <div className="mock-review-page">
                <p>Loading your test review...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mock-review-page">
                <p className="review-error">{error}</p>
                <Link to="/mock-test-history">
                    Back to Test History
                </Link>
            </div>
        );
    }

    if (!test) return null;

    return (
        <div className="mock-review-page">
            <div className="review-header">
                <div>
                    <h1>Test Review</h1>
                    <p>
                        {test.topic} · {test.difficulty} difficulty
                    </p>
                </div>

                <Link
                    to="/mock-test-history"
                    className="review-back-btn"
                >
                    Back to History
                </Link>
            </div>

            <div className="review-summary">
                <div className="review-stat">
                    <span>Score</span>
                    <strong>
                        {test.score}/{test.totalQuestions}
                    </strong>
                </div>

                <div className="review-stat">
                    <span>Percentage</span>
                    <strong>{test.percentage}%</strong>
                </div>

                <div className="review-stat">
                    <span>Questions</span>
                    <strong>{test.totalQuestions}</strong>
                </div>
            </div>

            <div className="review-questions">
                {test.results.map((result) => (
                    <article
                        className={`review-question-card ${
                            result.isCorrect
                                ? "answer-correct"
                                : "answer-incorrect"
                        }`}
                        key={result.questionNumber}
                    >
                        <div className="review-question-heading">
                            <h2>
                                Question {result.questionNumber}
                            </h2>

                            <span
                                className={`review-status ${
                                    result.isCorrect
                                        ? "status-correct"
                                        : "status-incorrect"
                                }`}
                            >
                                {result.isCorrect
                                    ? "Correct"
                                    : "Incorrect"}
                            </span>
                        </div>

                        <p className="review-question-text">
                            {result.question}
                        </p>

                        <div className="review-options">
                            {result.options.map((option, index) => {
                                const isSelected =
                                    option === result.userAnswer;

                                const isAnswer =
                                    option === result.correctAnswer;

                                let className = "review-option";

                                if (isAnswer) {
                                    className += " correct-option";
                                } else if (isSelected) {
                                    className += " selected-wrong-option";
                                }

                                return (
                                    <div
                                        className={className}
                                        key={index}
                                    >
                                        <span className="review-option-letter">
                                            {String.fromCharCode(65 + index)}
                                        </span>

                                        <span>{option}</span>

                                        {isAnswer && (
                                            <strong className="option-label">
                                                Correct answer
                                            </strong>
                                        )}

                                        {isSelected && !isAnswer && (
                                            <strong className="option-label">
                                                Your answer
                                            </strong>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="review-answer-details">
                            <p>
                                <strong>Your answer: </strong>
                                {result.userAnswer || "Not answered"}
                            </p>

                            <p>
                                <strong>Correct answer: </strong>
                                {result.correctAnswer}
                            </p>
                        </div>

                        <div className="review-explanation">
                            <strong>Explanation</strong>
                            <p>{result.explanation}</p>
                        </div>
                    </article>
                ))}
            </div>

            <div className="review-footer">
                <Link
                    to="/mock-test-history"
                    className="review-back-btn"
                >
                    Return to Test History
                </Link>
            </div>
        </div>
    );
}

export default MockTestReview;

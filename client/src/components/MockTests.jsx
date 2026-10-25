import { useState } from "react";
import api from "../api/axios";
import "./MockTests.css";

const MockTests = () => {
    // -----------------------------
    // Setup state
    // -----------------------------
    const [topic, setTopic] = useState("JavaScript");
    const [difficulty, setDifficulty] = useState("Medium");
    const [numberOfQuestions, setNumberOfQuestions] = useState(5);

    // -----------------------------
    // Test state
    // -----------------------------
    const [testId, setTestId] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);

    // -----------------------------
    // Result state
    // -----------------------------
    const [result, setResult] = useState(null);

    // -----------------------------
    // UI state
    // -----------------------------
    const [stage, setStage] = useState("setup");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // ==========================================
    // 1. Generate mock test
    // ==========================================
    const startTest = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.post(
                "/api/mock-tests/generate",
                {
                    topic,
                    difficulty,
                    numberOfQuestions
                }
            );

            const generatedTest = response.data.test;

            setTestId(generatedTest._id);

            // Fetch questions using test ID
            const testResponse = await api.get(
                `/api/mock-tests/${generatedTest._id}`
            );

            setQuestions(testResponse.data.test.questions);

            // Create empty answers array
            setAnswers(
                new Array(
                    testResponse.data.test.questions.length
                ).fill(null)
            );

            setCurrentQuestion(0);

            // Move from setup screen to test screen
            setStage("test");

        } catch (error) {
            console.error(
                "Error starting test:",
                error.response?.data || error.message
            );

            setError(
                error.response?.data?.message ||
                "Failed to generate mock test"
            );

        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // 2. Select answer
    // ==========================================
    const selectAnswer = (answer) => {
        const updatedAnswers = [...answers];

        updatedAnswers[currentQuestion] = answer;

        setAnswers(updatedAnswers);
    };

    // ==========================================
    // 3. Go to next question
    // ==========================================
    const nextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    // ==========================================
    // 4. Go to previous question
    // ==========================================
    const previousQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    // ==========================================
    // 5. Submit test
    // ==========================================
    const submitTest = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.post(
                `/api/mock-tests/${testId}/submit`,
                {
                    answers
                }
            );

            setResult(response.data);

            setStage("result");

        } catch (error) {
            console.error(
                "Error submitting test:",
                error.response?.data || error.message
            );

            setError(
                error.response?.data?.message ||
                "Failed to submit test"
            );

        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // 6. Start another test
    // ==========================================
    const resetTest = () => {
        setTestId(null);
        setQuestions([]);
        setCurrentQuestion(0);
        setAnswers([]);
        setResult(null);
        setError("");
        setStage("setup");
    };

    // ==========================================
    // SETUP SCREEN
    // ==========================================
    if (stage === "setup") {
        return (
            <div className="mock-tests-page">
                <div className="mock-test-container">

                    <div className="mock-test-header">
                        <h1>Mock Test</h1>

                        <p>
                            Test your technical knowledge with
                            AI-generated questions.
                        </p>
                    </div>

                    {error && (
                        <div className="mock-test-error">
                            {error}
                        </div>
                    )}

                    <div className="mock-test-form">

                        <div className="form-group">
                            <label>Topic</label>

                            <select
                                value={topic}
                                onChange={(e) =>
                                    setTopic(e.target.value)
                                }
                            >
                                <option value="JavaScript">
                                    JavaScript
                                </option>

                                <option value="React">
                                    React
                                </option>

                                <option value="Node.js">
                                    Node.js
                                </option>

                                <option value="MongoDB">
                                    MongoDB
                                </option>

                                <option value="SQL">
                                    SQL
                                </option>

                                <option value="Data Structures">
                                    Data Structures
                                </option>

                                <option value="Algorithms">
                                    Algorithms
                                </option>

                                <option value="Java">
                                    Java
                                </option>

                                <option value="C++">
                                    C++
                                </option>

                                <option value="Python">
                                    Python
                                </option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Difficulty</label>

                            <select
                                value={difficulty}
                                onChange={(e) =>
                                    setDifficulty(e.target.value)
                                }
                            >
                                <option value="Easy">
                                    Easy
                                </option>

                                <option value="Medium">
                                    Medium
                                </option>

                                <option value="Hard">
                                    Hard
                                </option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Number of Questions</label>

                            <select
                                value={numberOfQuestions}
                                onChange={(e) =>
                                    setNumberOfQuestions(
                                        Number(e.target.value)
                                    )
                                }
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={15}>15</option>
                                <option value={20}>20</option>
                            </select>
                        </div>

                        <button
                            className="start-test-btn"
                            onClick={startTest}
                            disabled={loading}
                        >
                            {loading
                                ? "Generating Test..."
                                : "Start Test"}
                        </button>

                    </div>

                </div>
            </div>
        );
    }

    // ==========================================
    // TEST SCREEN
    // ==========================================
    if (stage === "test") {
        const question = questions[currentQuestion];

        return (
            <div className="mock-tests-page">
                <div className="mock-test-container">

                    <div className="test-top">

                        <div>
                            <span className="test-topic">
                                {topic}
                            </span>

                            <span className="test-difficulty">
                                {difficulty}
                            </span>
                        </div>

                        <div className="question-count">
                            Question {currentQuestion + 1} /{" "}
                            {questions.length}
                        </div>

                    </div>

                    <div className="progress-container">
                        <div
                            className="progress-bar"
                            style={{
                                width: `${
                                    ((currentQuestion + 1) /
                                        questions.length) *
                                    100
                                }%`
                            }}
                        ></div>
                    </div>

                    <div className="question-card">

                        <h2>
                            {question.question}
                        </h2>

                        <div className="options-container">

                            {question.options.map(
                                (option, index) => (
                                    <button
                                        key={index}
                                        className={`option ${
                                            answers[
                                                currentQuestion
                                            ] === option
                                                ? "selected"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            selectAnswer(option)
                                        }
                                    >
                                        <span className="option-letter">
                                            {String.fromCharCode(
                                                65 + index
                                            )}
                                        </span>

                                        <span>
                                            {option}
                                        </span>
                                    </button>
                                )
                            )}

                        </div>

                    </div>

                    {error && (
                        <div className="mock-test-error">
                            {error}
                        </div>
                    )}

                    <div className="test-navigation">

                        <button
                            className="secondary-btn"
                            onClick={previousQuestion}
                            disabled={currentQuestion === 0}
                        >
                            Previous
                        </button>

                        {currentQuestion ===
                        questions.length - 1 ? (
                            <button
                                className="submit-btn"
                                onClick={submitTest}
                                disabled={loading}
                            >
                                {loading
                                    ? "Submitting..."
                                    : "Submit Test"}
                            </button>
                        ) : (
                            <button
                                className="next-btn"
                                onClick={nextQuestion}
                            >
                                Next
                            </button>
                        )}

                    </div>

                </div>
            </div>
        );
    }

    // ==========================================
    // RESULT SCREEN
    // ==========================================
    if (stage === "result") {
        return (
            <div className="mock-tests-page">
                <div className="mock-test-container">

                    <div className="result-header">
                        <h1>Test Completed</h1>

                        <p>
                            Here's how you performed.
                        </p>
                    </div>

                    <div className="score-card">

                        <div className="score">
                            {result.score} /{" "}
                            {result.totalQuestions}
                        </div>

                        <div className="percentage">
                            {result.percentage}%
                        </div>

                    </div>

                    <div className="result-stats">

                        <div className="result-stat">
                            <span>Correct</span>

                            <strong>
                                {result.score}
                            </strong>
                        </div>

                        <div className="result-stat">
                            <span>Incorrect</span>

                            <strong>
                                {result.totalQuestions -
                                    result.score}
                            </strong>
                        </div>

                        <div className="result-stat">
                            <span>Total</span>

                            <strong>
                                {result.totalQuestions}
                            </strong>
                        </div>

                    </div>

                    <div className="review-section">

                        <h2>Review Answers</h2>

                        {result.results.map(
                            (item) => (
                                <div
                                    key={
                                        item.questionNumber
                                    }
                                    className={`review-card ${
                                        item.isCorrect
                                            ? "correct"
                                            : "incorrect"
                                    }`}
                                >

                                    <div className="review-question">

                                        <span>
                                            Q
                                            {
                                                item.questionNumber
                                            }
                                        </span>

                                        <strong>
                                            {
                                                item.question
                                            }
                                        </strong>

                                    </div>

                                    <p>
                                        <strong>
                                            Your answer:
                                        </strong>{" "}
                                        {item.userAnswer ||
                                            "Not answered"}
                                    </p>

                                    {!item.isCorrect && (
                                        <p>
                                            <strong>
                                                Correct answer:
                                            </strong>{" "}
                                            {
                                                item.correctAnswer
                                            }
                                        </p>
                                    )}

                                    <p>
                                        <strong>
                                            Explanation:
                                        </strong>{" "}
                                        {
                                            item.explanation
                                        }
                                    </p>

                                    <div className="answer-status">
                                        {item.isCorrect
                                            ? "✓ Correct"
                                            : "✗ Incorrect"}
                                    </div>

                                </div>
                            )
                        )}

                    </div>

                    <button
                        className="start-test-btn"
                        onClick={resetTest}
                    >
                        Take Another Test
                    </button>

                </div>
            </div>
        );
    }

    return null;
};

export default MockTests;
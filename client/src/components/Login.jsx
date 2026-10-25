
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

function Login() {
    const { setToken } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/login",
                { email, password }
            );

            const token = response.data.token;

            localStorage.setItem("token", token);
            setToken(token);

            setMessage(response.data.message || "Login successful!");

            navigate("/dashboard");
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Unable to log in. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="login-page">
            <section className="login-brand-panel">
                <Link to="/" className="login-brand">
                    <span className="login-brand-icon">✦</span>
                    <span>
                        AI Career <strong>Copilot</strong>
                    </span>
                </Link>

                <div className="login-brand-content">
                    <span className="login-eyebrow">
                        YOUR FUTURE STARTS HERE
                    </span>

                    <h1>
                        Build your dream career with{" "}
                        <span>AI.</span>
                    </h1>

                    <p className="login-brand-description">
                        Take control of your career journey with
                        personalized insights, smarter preparation,
                        and the right opportunities.
                    </p>

                    <div className="login-feature-list">
                        <div className="login-feature">
                            <span className="login-feature-icon">▤</span>
                            <div>
                                <h3>Resume Analyzer</h3>
                                <p>Discover your strengths and improve your resume.</p>
                            </div>
                        </div>

                        <div className="login-feature">
                            <span className="login-feature-icon">↗</span>
                            <div>
                                <h3>Smart Job Matching</h3>
                                <p>Explore opportunities that match your skills.</p>
                            </div>
                        </div>

                        <div className="login-feature">
                            <span className="login-feature-icon">✧</span>
                            <div>
                                <h3>AI Mock Tests</h3>
                                <p>Practice technical questions and track your progress.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <p className="login-brand-footer">
                    Every step forward brings you closer to your goals.
                </p>
            </section>

            <section className="login-form-panel">
                <div className="login-top-link">
                    <span>New to Career Copilot?</span>
                    <Link to="/register">Create account</Link>
                </div>

                <div className="login-form-wrapper">
                    <div className="login-mobile-brand">
                        <span className="login-brand-icon">✦</span>
                        AI Career <strong>Copilot</strong>
                    </div>

                    <span className="login-form-eyebrow">
                        WELCOME BACK
                    </span>

                    <h2>Sign in to your account</h2>

                    <p className="login-form-subtitle">
                        Pick up where you left off and keep moving forward.
                    </p>

                    {message && (
                        <div
                            className={`login-message ${
                                message.toLowerCase().includes("success")
                                    ? "login-message-success"
                                    : "login-message-error"
                            }`}
                            role="status"
                        >
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="login-form">
                        <label htmlFor="login-email">Email address</label>

                        <div className="login-input-wrapper">
                            <span className="login-input-icon">@</span>
                            <input
                                id="login-email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                required
                            />
                        </div>

                        <div className="login-password-heading">
                            <label htmlFor="login-password">Password</label>
                        </div>

                        <div className="login-input-wrapper">
                            <span className="login-input-icon">⌑</span>
                            <input
                                id="login-password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                                required
                            />

                            <button
                                type="button"
                                className="login-password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="login-submit-btn"
                            disabled={loading}
                        >
                            {loading ? "Signing in..." : "Sign in"}
                            {!loading && <span>→</span>}
                        </button>
                    </form>

                    <div className="login-divider">
                        <span>YOUR CAREER JOURNEY</span>
                    </div>

                    <div className="login-bottom-note">
                        <span className="login-bottom-icon">✦</span>
                        <p>
                            Your next opportunity starts with one step.
                            <strong> Let's make it count.</strong>
                        </p>
                    </div>

                    <p className="login-register-prompt">
                        Don't have an account?{" "}
                        <Link to="/register">Create one for free</Link>
                    </p>
                </div>

                <p className="login-legal">
                    AI Career Copilot · Built for your next big move
                </p>
            </section>
        </main>
    );
}

export default Login;

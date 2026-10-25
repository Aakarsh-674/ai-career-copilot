
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";

function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage("");

        if (name.trim().length < 2) {
            setMessage("Please enter a name with at least 2 characters.");
            return;
        }

        if (password.length < 6) {
            setMessage("Your password must contain at least 6 characters.");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/register",
                {
                    name: name.trim(),
                    email: email.trim(),
                    password
                }
            );

            setMessage(
                response.data.message || "Account created successfully!"
            );

            setTimeout(() => {
                navigate("/login");
            }, 1000);
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Unable to create your account. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const isSuccess =
        message.toLowerCase().includes("success") ||
        message.toLowerCase().includes("registered");

    return (
        <main className="register-page">
            <section className="register-brand-panel">
                <Link to="/" className="register-brand">
                    <span className="register-brand-icon">✦</span>
                    <span>
                        AI Career <strong>Copilot</strong>
                    </span>
                </Link>

                <div className="register-brand-content">
                    <span className="register-eyebrow">
                        START YOUR JOURNEY
                    </span>

                    <h1>
                        Your next chapter starts <span>here.</span>
                    </h1>

                    <p className="register-brand-description">
                        Create your account and get the tools you need
                        to build skills, improve your resume, and move
                        closer to your dream career.
                    </p>

                    <div className="register-feature-list">
                        <div className="register-feature">
                            <span className="register-feature-icon">▤</span>
                            <div>
                                <h3>Build a stronger resume</h3>
                                <p>Get AI-powered feedback to improve your profile.</p>
                            </div>
                        </div>

                        <div className="register-feature">
                            <span className="register-feature-icon">↗</span>
                            <div>
                                <h3>Discover opportunities</h3>
                                <p>Find job matches based on your skills.</p>
                            </div>
                        </div>

                        <div className="register-feature">
                            <span className="register-feature-icon">✧</span>
                            <div>
                                <h3>Prepare with confidence</h3>
                                <p>Practice with AI-generated technical mock tests.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <p className="register-brand-footer">
                    Small steps today. Bigger opportunities tomorrow.
                </p>
            </section>

            <section className="register-form-panel">
                <div className="register-top-link">
                    <span>Already have an account?</span>
                    <Link to="/login">Sign in</Link>
                </div>

                <div className="register-form-wrapper">
                    <div className="register-mobile-brand">
                        <span className="register-brand-icon">✦</span>
                        <span>
                            AI Career <strong>Copilot</strong>
                        </span>
                    </div>

                    <span className="register-form-eyebrow">
                        CREATE YOUR ACCOUNT
                    </span>

                    <h2>Start your journey</h2>

                    <p className="register-form-subtitle">
                        Join Career Copilot and take the next step in your career.
                    </p>

                    {message && (
                        <div
                            className={`register-message ${
                                isSuccess
                                    ? "register-message-success"
                                    : "register-message-error"
                            }`}
                            role="status"
                        >
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="register-form">
                        <label htmlFor="register-name">Full name</label>

                        <div className="register-input-wrapper">
                            <span className="register-input-icon">♙</span>
                            <input
                                id="register-name"
                                type="text"
                                placeholder="Enter your full name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                autoComplete="name"
                                minLength={2}
                                maxLength={100}
                                required
                            />
                        </div>

                        <label htmlFor="register-email">Email address</label>

                        <div className="register-input-wrapper">
                            <span className="register-input-icon">@</span>
                            <input
                                id="register-email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                required
                            />
                        </div>

                        <label htmlFor="register-password">Password</label>

                        <div className="register-input-wrapper">
                            <span className="register-input-icon">⌑</span>
                            <input
                                id="register-password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Create a password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="new-password"
                                minLength={6}
                                required
                            />

                            <button
                                type="button"
                                className="register-password-toggle"
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

                        <p className="register-password-hint">
                            Use at least 6 characters for your password.
                        </p>

                        <button
                            type="submit"
                            className="register-submit-btn"
                            disabled={loading}
                        >
                            {loading ? "Creating account..." : "Create account"}
                            {!loading && <span>→</span>}
                        </button>
                    </form>

                    <div className="register-divider">
                        <span>YOUR FUTURE, YOUR JOURNEY</span>
                    </div>

                    <div className="register-bottom-note">
                        <span className="register-bottom-icon">✦</span>
                        <p>
                            One account. More ways to grow.
                            <strong> Your career starts here.</strong>
                        </p>
                    </div>

                    <p className="register-login-prompt">
                        Already registered?{" "}
                        <Link to="/login">Sign in to continue</Link>
                    </p>
                </div>

                <p className="register-legal">
                    AI Career Copilot · Built for your next big move
                </p>
            </section>
        </main>
    );
}

export default Register;


import { Link } from "react-router-dom";
import "./Home.css";

const features = [
    {
        icon: "📄",
        title: "AI Resume Analysis",
        description:
            "Analyze your resume, discover your strengths, and get actionable suggestions to improve it."
    },
    {
        icon: "🎯",
        title: "Smart Job Matching",
        description:
            "Explore remote opportunities and discover which of your skills match each job listing."
    },
    {
        icon: "🧠",
        title: "Mock Tests",
        description:
            "Practice technical questions, test your knowledge, and review your previous attempts."
    },
    {
        icon: "📈",
        title: "Track Your Progress",
        description:
            "Review your performance and identify areas where you can improve your career readiness."
    }
];

function Home() {
    return (
        <main className="home-page">
            <section className="home-hero">
                <div className="hero-glow hero-glow-one"></div>
                <div className="hero-glow hero-glow-two"></div>

                <div className="hero-content">
                    <div className="hero-badge">
                        <span className="status-dot"></span>
                        YOUR PERSONAL AI CAREER ASSISTANT
                    </div>

                    <h1>
                        Your career.
                        <br />
                        Your potential.
                        <br />
                        <span>Powered by AI.</span>
                    </h1>

                    <p className="hero-description">
                        Analyze your resume, discover relevant job
                        opportunities, practice mock tests, and take
                        control of your career journey — all in one place.
                    </p>

                    <div className="hero-actions">
                        <Link to="/register" className="home-btn home-btn-primary">
                            Get Started Free
                            <span aria-hidden="true">→</span>
                        </Link>

                        <Link to="/login" className="home-btn home-btn-secondary">
                            Sign In
                        </Link>
                    </div>

                    <div className="hero-trust">
                        <span>✦</span>
                        Built for students and aspiring professionals
                    </div>
                </div>

                <div className="hero-visual">
                    <div className="preview-window">
                        <div className="preview-topbar">
                            <div className="preview-dots">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                            <span>career-copilot / dashboard</span>
                        </div>

                        <div className="preview-body">
                            <div className="preview-greeting">
                                <div>
                                    <span className="preview-label">
                                        YOUR CAREER OVERVIEW
                                    </span>
                                    <h3>Ready to level up?</h3>
                                </div>
                                <div className="preview-avatar">AI</div>
                            </div>

                            <div className="preview-stats">
                                <div className="preview-stat">
                                    <span>Resume Score</span>
                                    <strong>90<small>/100</small></strong>
                                    <div className="preview-progress">
                                        <span style={{ width: "90%" }}></span>
                                    </div>
                                </div>

                                <div className="preview-stat">
                                    <span>Skills Identified</span>
                                    <strong>36</strong>
                                    <small className="preview-positive">
                                        Your skill profile
                                    </small>
                                </div>
                            </div>

                            <div className="preview-panel">
                                <div className="preview-panel-heading">
                                    <div>
                                        <span className="preview-label">
                                            CAREER OPPORTUNITIES
                                        </span>
                                        <h4>Recommended next steps</h4>
                                    </div>
                                    <span className="preview-sparkle">✦</span>
                                </div>

                                <div className="preview-item">
                                    <div className="preview-item-icon">📄</div>
                                    <div className="preview-item-copy">
                                        <strong>Improve your resume</strong>
                                        <span>AI-powered suggestions</span>
                                    </div>
                                    <span className="preview-arrow">↗</span>
                                </div>

                                <div className="preview-item">
                                    <div className="preview-item-icon">💼</div>
                                    <div className="preview-item-copy">
                                        <strong>Explore job matches</strong>
                                        <span>Find your next opportunity</span>
                                    </div>
                                    <span className="preview-arrow">↗</span>
                                </div>

                                <div className="preview-item">
                                    <div className="preview-item-icon">🧠</div>
                                    <div className="preview-item-copy">
                                        <strong>Practice a mock test</strong>
                                        <span>Prepare with confidence</span>
                                    </div>
                                    <span className="preview-arrow">↗</span>
                                </div>
                            </div>

                            <div className="preview-footer">
                                <span className="status-dot"></span>
                                YOUR NEXT CHAPTER STARTS HERE
                            </div>
                        </div>
                    </div>

                    <div className="floating-card floating-card-top">
                        <span className="floating-icon">✦</span>
                        <div>
                            <strong>AI-powered insights</strong>
                            <span>Personalized for you</span>
                        </div>
                    </div>

                    <div className="floating-card floating-card-bottom">
                        <span className="floating-icon">✓</span>
                        <div>
                            <strong>One place. One goal.</strong>
                            <span>Your career growth</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="home-features" id="features">
                <div className="features-heading">
                    <span className="section-eyebrow">EVERYTHING YOU NEED</span>
                    <h2>
                        Build your future,
                        <br />
                        <span>one step at a time.</span>
                    </h2>
                    <p>
                        From your first resume review to your next interview,
                        get the tools to move forward with confidence.
                    </p>
                </div>

                <div className="features-grid">
                    {features.map((feature, index) => (
                        <article className="feature-card" key={feature.title}>
                            <div className="feature-icon">{feature.icon}</div>
                            <span className="feature-number">
                                0{index + 1}
                            </span>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="home-cta">
                <div className="cta-glow"></div>
                <span className="section-eyebrow">YOUR NEXT CHAPTER</span>
                <h2>
                    Stop wondering.
                    <br />
                    <span>Start preparing.</span>
                </h2>
                <p>
                    Take the next step toward your career goals with AI Career Copilot.
                </p>
                <Link to="/register" className="home-btn home-btn-primary">
                    Start Your Journey <span aria-hidden="true">→</span>
                </Link>
            </section>

            <footer className="home-footer">
                <Link to="/" className="footer-brand">
                    <span className="footer-brand-icon">✦</span>
                    AI Career Copilot
                </Link>
                <span>Build skills. Find opportunities. Grow with confidence.</span>
            </footer>
        </main>
    );
}

export default Home;

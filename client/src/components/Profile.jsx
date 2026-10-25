
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import "./Profile.css";

function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const getProfile = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await api.get("/api/user/profile");
            setUser(response.data.user);
        } catch (err) {
            console.error("Error fetching profile:", err);
            setError(
                err.response?.data?.message ||
                "Unable to load your profile. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getProfile();
    }, [getProfile]);

    const name = user?.name?.trim() || "User";
    const initial = name.charAt(0).toUpperCase();
    const email = user?.email || "Email not available";

    return (
        <main className="profile-page">
            <header className="profile-page-header">
                <div>
                    <span className="profile-eyebrow">
                        YOUR ACCOUNT
                    </span>
                    <h1>My Profile</h1>
                    <p>
                        Manage your account and continue building
                        your career with Career Copilot.
                    </p>
                </div>

                <div className="profile-header-icon">♙</div>
            </header>

            {loading ? (
                <section className="profile-state-card">
                    <div className="profile-spinner" />
                    <p>Loading your profile...</p>
                </section>
            ) : error ? (
                <section className="profile-state-card">
                    <div className="profile-state-icon">!</div>
                    <h2>Couldn't load your profile</h2>
                    <p>{error}</p>
                    <button
                        type="button"
                        className="profile-primary-btn"
                        onClick={getProfile}
                    >
                        Try again
                    </button>
                </section>
            ) : user ? (
                <>
                    <section className="profile-hero-card">
                        <div className="profile-avatar">
                            {initial}
                        </div>

                        <div className="profile-hero-info">
                            <span className="profile-member-label">
                                CAREER COPILOT MEMBER
                            </span>
                            <h2>{name}</h2>
                            <p>{email}</p>
                            <span className="profile-status">
                                <span className="profile-status-dot" />
                                Account information loaded
                            </span>
                        </div>

                        <div className="profile-hero-decoration">✦</div>
                    </section>

                    <section className="profile-details-section">
                        <div className="profile-section-heading">
                            <div>
                                <h2>Personal Information</h2>
                                <p>Your account details</p>
                            </div>
                            <span className="profile-section-icon">▤</span>
                        </div>

                        <div className="profile-details-grid">
                            <article className="profile-detail-card">
                                <div className="profile-detail-icon">
                                    ♙
                                </div>
                                <div>
                                    <span>Full Name</span>
                                    <h3>{name}</h3>
                                </div>
                            </article>

                            <article className="profile-detail-card">
                                <div className="profile-detail-icon">
                                    @
                                </div>
                                <div>
                                    <span>Email Address</span>
                                    <h3 className="profile-email">
                                        {email}
                                    </h3>
                                </div>
                            </article>
                        </div>
                    </section>

                    <section className="profile-career-section">
                        <div className="profile-career-copy">
                            <span className="profile-career-icon">✧</span>
                            <div>
                                <h2>Your next career step starts here</h2>
                                <p>
                                    Analyze your resume, explore job matches,
                                    and practice with AI-generated mock tests.
                                </p>
                            </div>
                        </div>

                        <div className="profile-career-actions">
                            <Link
                                to="/resume"
                                className="profile-primary-btn"
                            >
                                Analyze Resume <span>→</span>
                            </Link>
                            <Link
                                to="/dashboard"
                                className="profile-secondary-btn"
                            >
                                View Dashboard
                            </Link>
                        </div>
                    </section>
                </>
            ) : (
                <section className="profile-state-card">
                    <div className="profile-state-icon">♙</div>
                    <h2>Profile unavailable</h2>
                    <p>No profile information was returned.</p>
                    <button
                        type="button"
                        className="profile-primary-btn"
                        onClick={getProfile}
                    >
                        Try again
                    </button>
                </section>
            )}
        </main>
    );
}

export default Profile;

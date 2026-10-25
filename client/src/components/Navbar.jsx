
import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    const closeMenu = () => {
        setMenuOpen(false);
    };

    const getLinkClass = ({ isActive }) =>
        isActive ? "navbar-link active" : "navbar-link";

    return (
        <nav className="app-navbar">
            <div className="navbar-container">
                {/* Brand */}
                <NavLink
                    to="/"
                    className="navbar-brand"
                    onClick={closeMenu}
                    end
                >
                    <span className="navbar-brand-icon">✦</span>
                    <span>Career<span className="brand-highlight">Copilot</span></span>
                </NavLink>

                {/* Mobile menu button */}
                <button
                    type="button"
                    className="navbar-menu-toggle"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
                    aria-expanded={menuOpen}
                    aria-controls="navbar-navigation"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                {/* Navigation links */}
                <div
                    id="navbar-navigation"
                    className={`navbar-navigation ${menuOpen ? "navbar-navigation-open" : ""}`}
                >
                    <NavLink
                        to="/"
                        className={getLinkClass}
                        onClick={closeMenu}
                        end
                    >
                        Home
                    </NavLink>

                    <NavLink
                        to="/dashboard"
                        className={getLinkClass}
                        onClick={closeMenu}
                    >
                        Dashboard
                    </NavLink>

                    <NavLink
                        to="/resume"
                        className={getLinkClass}
                        onClick={closeMenu}
                    >
                        Resume
                    </NavLink>

                    <NavLink
                        to="/jobs"
                        className={getLinkClass}
                        onClick={closeMenu}
                    >
                        Jobs
                    </NavLink>

                    <NavLink
                        to="/mock-tests"
                        className={getLinkClass}
                        onClick={closeMenu}
                    >
                        Mock Tests
                    </NavLink>

                    <NavLink
                        to="/mock-test-history"
                        className={getLinkClass}
                        onClick={closeMenu}
                    >
                        Test History
                    </NavLink>

                    <NavLink
                        to="/profile"
                        className={getLinkClass}
                        onClick={closeMenu}
                    >
                        Profile
                    </NavLink>

                    <div className="navbar-auth-links">
                        <NavLink
                            to="/login"
                            className="navbar-login"
                            onClick={closeMenu}
                        >
                            Login
                        </NavLink>

                        <NavLink
                            to="/register"
                            className="navbar-register"
                            onClick={closeMenu}
                        >
                            Get Started
                        </NavLink>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;

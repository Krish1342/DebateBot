import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-brand">
                    <span className="brand-text">Debate</span>
                    <span className="brand-accent">Bot</span>
                </div>

                <div className="navbar-links">
                    <NavLink
                        to="/"
                        className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                    >
                        AI Debate
                    </NavLink>
                    <NavLink
                        to="/live-arena"
                        className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                    >
                        Live Arena
                    </NavLink>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;

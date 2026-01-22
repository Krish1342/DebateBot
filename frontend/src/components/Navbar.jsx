import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Show navbar when at top or scrolling up
            if (currentScrollY < 50) {
                setIsVisible(true);
            } else if (currentScrollY < lastScrollY) {
                setIsVisible(true);
            } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    // Reset visibility on route change
    useEffect(() => {
        setIsVisible(true);
        setLastScrollY(0);
    }, [location]);

    return (
        <nav className={`navbar ${isVisible ? "visible" : "hidden"}`}>
            <div className="navbar-container">
                <div className="navbar-links">
                    <NavLink
                        to="/"
                        className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/debate"
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
                    <NavLink
                        to="/scoring"
                        className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                    >
                        Training
                    </NavLink>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;

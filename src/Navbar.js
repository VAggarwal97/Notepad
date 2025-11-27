import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { ThemeContext } from "./context/ThemeContext";
import { BoardsContext } from "./context/BoardsContext";
import { FaMoon, FaSun } from "react-icons/fa";

import "./styles/Navbar.css";

export default function Navbar() {
    const { darkMode, toggleDarkMode } = useContext(ThemeContext);
    const { boards } = useContext(BoardsContext);
    const loc = useLocation();

    const active = (path) => loc.pathname.startsWith(path);

    return (
        <nav className={`navbar ${darkMode ? "dark-mode" : ""}`}>
            <div className="nav-left">
                <div className="logo">My Notepad</div>
            </div>

            <div className="nav-center">
                <Link to="/" className={`nav-link ${active("/") && !active("/board") ? "active" : ""}`}>Home</Link>
                <Link to={`/board/${boards?.[0]?.id || ""}`} className={`nav-link ${active("/board") ? "active" : ""}`}>Board</Link>
            </div>

            <div className="nav-actions">
                <button className="icon-btn" onClick={toggleDarkMode} aria-label="Toggle theme">
                    {darkMode ? <FaSun /> : <FaMoon />}
                </button>

                <button className="login-btn">Login</button>
            </div>
        </nav>
    );
}

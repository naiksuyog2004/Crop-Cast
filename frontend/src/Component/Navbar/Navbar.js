import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ Login, handleAuth, name }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    console.log(name);
    const openOption = () => {
        setShowDropdown((prev) => !prev);
    };

    const handleOptionClick = (option) => {
        console.log(option); // Handle option click logic here
        setShowDropdown(false);
    };

    return (
        <header className="header">
            <h1>🌾 Crop Cast</h1>
            <div className="nav-components">
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Dropdown /></li>
                    <li>location</li>
                    <li><Link to="/about">About Us</Link></li>
                    <li>
                        <Link
                            to={Login ? "/" : "/login"}
                            onClick={handleAuth}
                        >
                            {Login ? "Logout" : "Login"}
                        </Link>
                    </li>
                </ul>
            </div>

            <div className="search-container">
                <input
                    type="text"
                    className="crop-input"
                    placeholder="Enter crop name..."
                />
                <button className="search-button">Check Weather</button>
            </div>

            <div style={{ position: "relative" }}>
                <button className="symbol" onClick={openOption}>
                    {name && Login ? `${name}` : ""}
                </button>

                {showDropdown && (
                    <ul
                        style={{
                            position: "absolute",
                            top: "100%",
                            right: 0,
                            marginTop: "8px",
                            padding: "10px",
                            borderRadius: "5px",
                            backgroundColor: "white",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                            zIndex: 1000,
                            listStyleType: "none",
                        }}
                    >
                        <li
                            style={{
                                padding: "8px 12px",
                                cursor: "pointer",
                                borderBottom: "1px solid #eee",
                            }}
                            onClick={() => handleOptionClick("Profile")}
                        >
                            <Link style={{ color: 'inherit', textDecoration: 'none' }} to={"/dashboard"}>Profile</Link>
                        </li>
                        <li
                            style={{
                                padding: "8px 12px",
                                cursor: "pointer",
                                borderBottom: "1px solid #eee",
                            }}
                            onClick={() => handleOptionClick("Settings")}
                        >
                            Settings
                        </li>
                        <li
                            style={{ padding: "8px 12px", cursor: "pointer" }}
                            onClick={() => handleOptionClick("Logout")}
                        >
                            <Link style={{ color: 'inherit', textDecoration: 'none' }} to={"/login"}>Logout</Link>
                        </li>
                    </ul>
                )}
            </div>
        </header>
    );
};

const Dropdown = () => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="dropdown-container" ref={dropdownRef}>
            <button className="dropdown-button" onClick={toggleDropdown}>
                Crop Info
            </button>
            {isDropdownOpen && (
                <ul className="dropdown-menu">
                    <li><Link to="/rice">Rice</Link></li>
                    <li><Link to="/wheat">Wheat</Link></li>
                    <li><Link to="/sugarcane">Sugarcane</Link></li>
                </ul>
            )}
        </div>
    );
};

export default Navbar;
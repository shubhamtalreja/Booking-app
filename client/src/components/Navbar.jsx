import React from "react";
import { Link } from 'react-router-dom';
import './Navbar.css';


const Navbar = () => {
    return (
        <>
            <nav className="navbar">
                <div className="navbar-container">
                    {/* The main logo/brand name. Clicking it links to the homepage. */}
                    <Link to="/" className="navbar-logo">
                        Glamour Booking
                    </Link>

                    {/* This will hold our navigation links. */}
                    <ul className="nav-menu">
                        <li className="nav-item">
                            {/* The Link component is the React Router way to create links. */}
                            {/* It prevents full page reloads, creating a smooth SPA experience. */}
                            <Link to="/" className="nav-links">
                                Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/booking" className="nav-links">
                                Book Now
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/login" className="nav-links">
                                Login
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/register" className="nav-links">
                                Register
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    )

}

export default Navbar;
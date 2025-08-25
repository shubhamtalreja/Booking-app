import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Easy Appointment
        </Link>
        
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-links">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/booking" className="nav-links">
              Book Now
            </Link>
          </li>

          {user ? (
            <>
              {user.role === 'admin' && (
                <li className="nav-item">
                  <Link to="/admin/dashboard" className="nav-links">
                    Dashboard
                  </Link>
                </li>
              )}
              {user.role === 'client' && (
                <li className="nav-item">
                  <Link to="/dashboard" className="nav-links">
                    Dashboard
                  </Link>
                </li>
              )}
              <li className="nav-item">
                <button onClick={logout} className="nav-links-button">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
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
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
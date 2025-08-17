import React from 'react';
import './Footer.css'; // Import styles for the footer

const Footer = () => {
  return (
    // Use the <footer> semantic HTML tag
    <footer className="footer">
      <div className="footer-container">
        <p className="footer-text">
          &copy; {new Date().getFullYear()} Glamour Booking. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
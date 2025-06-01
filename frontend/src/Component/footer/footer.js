import React from 'react';
import './footer.css'; // Import the CSS file for styling

const Footer = () => {
    return (
        <footer className="footer">
            <p>🌾 CropCast App © 2025 | All Rights Reserved</p>
            <p>
                Developed by <a href="https://github.com/your-profile" target="_blank" rel="noopener noreferrer">Suyog Naik , Atharva Naik , Om Mhatre </a>
            </p>
            <p>
                Contact: <a href="mailto:support@cropcast.com">support@cropcast.com</a>
            </p>
        </footer>
    );
};

export default Footer;
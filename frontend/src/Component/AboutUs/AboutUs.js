import React from 'react';
import './AboutUs.css';
import Navbar from '../Navbar/Navbar';
import Footer from '../footer/footer';

const AboutUs = ({ Login, handleAuth, name }) => {
    return (
        <>
            <Navbar Login={Login} handleAuth={handleAuth} name={name} />
            <div className="about-us">

                <div className="aboutbackground"></div>

                <h2>About CropCast</h2>
                <p>
                    🌾 <strong>CropCast</strong> is a cutting-edge application designed to help farmers make informed decisions about their crops.
                    By leveraging advanced weather forecasting and machine learning models, we provide insights into crop suitability,
                    weather conditions, and precautions to ensure optimal growth.
                </p>
                <h3>Our Mission</h3>
                <p>
                    Our mission is to empower farmers with technology, enabling them to maximize productivity while minimizing risks
                    caused by unpredictable weather conditions.
                </p>
                <h3>Features</h3>
                <ul>
                    <li>🌤️ 7-day weather forecast tailored for agriculture</li>
                    <li>📊 Crop suitability predictions based on weather data</li>
                    <li>⚠️ Precautionary measures to protect crops</li>
                    <li>📱 SMS notifications for critical updates</li>
                </ul>
                <h3>Contact Us</h3>
                <p>
                    Have questions or need support? Reach out to us at <a href="mailto:support@cropcast.com">support@cropcast.com</a>.
                </p>
            </div>
            <Footer />
        </>
    );
};

export default AboutUs;
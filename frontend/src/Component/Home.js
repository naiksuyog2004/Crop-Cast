
import React, { useState } from 'react';
import './Home.css';
import Weather from '../features/CurrentLocation';
import Footer from './footer/footer';
import Navbar from './Navbar/Navbar';

const Home = ({ name }) => {
    const [Login, setLogin] = useState(true);
    const [forecast, setForecast] = useState([]);
    const [weatherNow, setWeatherNow] = useState(null);
    // console.log(district);
    const handleAuth = () => {
        setLogin(!Login);
    };

    return (
        <div>
            <div className="background"></div>
            <div className="home-container">
                {/* Use the Navbar component */}
                <Navbar Login={Login} handleAuth={handleAuth} name={name} />

                {Login ? (
                    <>

                        <div className="side-component">
                            <div className="weather-info">
                                <h2>Today's Weather</h2>
                                <Weather
                                    onWeatherUpdate={(data) => setWeatherNow(data)}
                                    onForecastUpdate={(forecastData) => setForecast(forecastData)}
                                />
                            </div>

                            <div className="sidebar">
                                <div className="newtext">
                                    <h1 className="heading">Empower Your Farming with Timely Weather Alerts</h1>
                                    <h3 className="content">Stay informed about weather conditions that could impact your crops.</h3>
                                    <h3 className="content">CropCast helps you protect your harvest with real-time,</h3>
                                    <h3 className="content">SMS alerts tailored to your city.</h3>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <Text />
                )}
            </div>
            <Footer />
        </div >
    );
};

const Text = () => {
    return (
        <div className="text">
            <h1 className="heading">Empower Your Farming with Timely Weather Alerts</h1>
            <h3 className="content">Stay informed about weather conditions that could impact your crops.</h3>
            <h3 className="content">CropCast helps you protect your harvest with real-time,</h3>
            <h3 className="content">SMS alerts tailored to your city.</h3>
        </div>
    );
};

export default Home;


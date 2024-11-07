import React from 'react';
import './Home.css';
import Prediction from './Prediction';
import CurrentLocation from './CurrentLocation'

const Home = () => {
    return (
        <>
            <div className="background"></div>
            <div className="home-container">
                <header className="header">
                    <h1>🌾 Crop Cast</h1>
                    <p>Check if the weather is suitable for your crops today!</p>
                </header>

                <div className="search-container">
                    <input
                        type="text"
                        className="crop-input"
                        placeholder="Enter crop name..."
                    />
                    <button className="search-button">Check Weather</button>
                </div>
                <div className="side-component">
                    <div className="weather-info">
                        <h2>Today's Weather</h2>
                        <CurrentLocation />
                    </div>
                    <div className='prediction'>
                        <Prediction />
                    </div>
                </div>


            </div>
        </>
    );
};

export default Home;

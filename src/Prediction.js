import React, { useState, useEffect } from 'react';
import './App.css';

const cropData = [
    { name: "Rice", temperatureRange: [25, 35], rainfall: [1000, 3000] },
    { name: "Wheat", temperatureRange: [10, 25], rainfall: [500, 800] },
    { name: "Sugarcane", temperatureRange: [20, 30], rainfall: [1000, 1500] },
    // Add more crops here based on extracted data
];

const Prediction = () => {
    const [weather, setWeather] = useState({ temperature: 28, rainfall: 1200 });
    const [suitability, setSuitability] = useState([]);

    useEffect(() => {
        const checkSuitability = () => {
            const suitabilityData = cropData.map(crop => {
                const isTempSuitable =
                    weather.temperature >= crop.temperatureRange[0] &&
                    weather.temperature <= crop.temperatureRange[1];
                const isRainfallSuitable =
                    weather.rainfall >= crop.rainfall[0] &&
                    weather.rainfall <= crop.rainfall[1];
                return {
                    crop: crop.name,
                    suitable: isTempSuitable && isRainfallSuitable ? "Yes" : "No"
                };
            });
            setSuitability(suitabilityData);
        };

        checkSuitability();
    }, [weather]);

    return (
        <div className="home-container">
            <table className="crop-table">
                <thead>
                    <tr>
                        <th>Crop</th>
                        <th>Temperature Range (°C)</th>
                        <th>Rainfall (mm)</th>
                        <th>Suitable</th>
                    </tr>
                </thead>
                <tbody>
                    {suitability.map((item, index) => (
                        <tr key={index}>
                            <td>{item.crop}</td>
                            <td>{`${cropData[index].temperatureRange[0]} - ${cropData[index].temperatureRange[1]}`}</td>
                            <td>{`${cropData[index].rainfall[0]} - ${cropData[index].rainfall[1]}`}</td>
                            <td>{item.suitable}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Prediction;

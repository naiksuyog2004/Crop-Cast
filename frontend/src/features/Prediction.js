import React from 'react';

const Prediction = ({ prediction }) => {
    if (!prediction || prediction.length === 0) {
        return <p>No prediction data available.</p>;
    }

    return (
        <div className="prediction">
            <h4>Crop Suitability Prediction:</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {prediction.map((day, index) => (
                    <li key={index} style={{ marginBottom: '10px' }}>
                        <strong>{day.date || "Unknown Date"}:</strong> {day.status || "Unknown Status"}
                        <br />
                        <strong>Precautions:</strong> {Array.isArray(day.precautions) ? day.precautions.join(' ') : "No precautions available"}
                    </li>
                ))}
            </ul>
        </div>
    );
};



export default Prediction;
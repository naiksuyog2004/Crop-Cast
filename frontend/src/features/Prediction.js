// import React, { useEffect, useState } from 'react';
// import '../App.css';

// const cropData = [
//     { name: "Rice", temperatureRange: [25, 35], rainfall: [1000, 3000] },
//     { name: "Wheat", temperatureRange: [10, 25], rainfall: [500, 800] },
//     { name: "Sugarcane", temperatureRange: [20, 30], rainfall: [1000, 1500] },
//     // Add more crops as needed
// ];

// const Prediction = ({ forecast }) => {
//     const [suitability, setSuitability] = useState([]);

//     useEffect(() => {
//         const checkSuitability = () => {
//             const results = forecast.map((day) => {
//                 return {
//                     date: day.date,
//                     data: cropData.map(crop => {
//                         const isTempOk =
//                             day.temp >= crop.temperatureRange[0] &&
//                             day.temp <= crop.temperatureRange[1];
//                         const isRainOk =
//                             day.rainfall >= crop.rainfall[0] &&
//                             day.rainfall <= crop.rainfall[1];
//                         return {
//                             crop: crop.name,
//                             temp: day.temp,
//                             rainfall: day.rainfall,
//                             suitable: isTempOk || isRainOk ? "Yes" : "No"
//                         };
//                     })
//                 };
//             });
//             setSuitability(results);
//         };

//         if (forecast && forecast.length > 0) {
//             checkSuitability();
//         }
//     }, [forecast]);

//     return (
//         <div className="home-container">
//             {suitability.map((dayData, index) => (
//                 <div key={index} style={{ marginBottom: "30px" }}>
//                     <h3 style={{ color: "green" }}>{dayData.date}</h3>
//                     <table className="crop-table">
//                         <thead>
//                             <tr>
//                                 <th>Crop</th>
//                                 <th>Temp (°C)</th>
//                                 <th>Rainfall (mm)</th>
//                                 <th>Suitable</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {dayData.data.map((item, i) => (
//                                 <tr key={i}>
//                                     <td>{item.crop}</td>
//                                     <td>{item.temp}</td>
//                                     <td>{item.rainfall}</td>
//                                     <td>{item.suitable}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             ))}
//         </div>
//     );
// };

// export default Prediction;




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
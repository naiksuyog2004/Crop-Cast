// import React, { Component } from 'react';
// import Clock from 'react-live-clock';
// import ReactAnimatedWeather from 'react-animated-weather';
// import apiKeys from '../apiKeys';

// const dateBuilder = (d) => {
//     let months = [
//         "January", "February", "March", "April", "May", "June", "July",
//         "August", "September", "October", "November", "December"
//     ];
//     let days = [
//         "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
//     ];
//     let day = days[d.getDay()];
//     let date = d.getDate();
//     let month = months[d.getMonth()];
//     let year = d.getFullYear();
//     return `${day}, ${date} ${month} ${year}`;
// };

// const defaults = {
//     color: "white",
//     size: 112,
//     animate: true,
// };

// class Weather extends Component {
//     state = {
//         lat: undefined,
//         lon: undefined,
//         temperatureC: undefined,
//         humidity: undefined,
//         windSpeed: undefined,
//         windDirection: undefined,
//         city: undefined,
//         country: undefined,
//         main: undefined,
//         icon: "CLEAR_DAY",
//         rainfall: undefined,
//         loading: true,
//         error: null,
//     };

//     componentDidMount() {
//         this.getLocation();
//         this.timerID = setInterval(() => {
//             if (this.state.lat && this.state.lon) {
//                 this.getWeather(this.state.lat, this.state.lon);
//             }
//         }, 300000);
//     }

//     componentWillUnmount() {
//         clearInterval(this.timerID);
//     }

//     getLocation = () => {
//         if (navigator.geolocation) {
//             const options = {
//                 enableHighAccuracy: true,  // Request high accuracy
//                 timeout: 10000,           // 10 seconds timeout
//                 maximumAge: 0              // Don't use cached position
//             };

//             navigator.geolocation.getCurrentPosition(
//                 (position) => {
//                     this.getWeather(position.coords.latitude, position.coords.longitude);
//                 },
//                 (error) => {
//                     console.error("Geolocation error:", error);
//                     this.setState({ loading: false, error: "Could not get your location. Using default location." });
//                     this.getWeatherByIP(); // Fallback to IP-based location
//                 },
//                 options
//             );
//         } else {
//             this.setState({ loading: false, error: "Geolocation is not supported by your browser." });
//             this.getWeatherByIP(); // Fallback to IP-based location
//         }
//     };

//     getWeatherByIP = async () => {
//         try {
//             // First get approximate location by IP
//             const ipResponse = await fetch('https://ipapi.co/json/');
//             const ipData = await ipResponse.json();

//             // Then get weather for that location
//             await this.getWeather(ipData.latitude, ipData.longitude);
//         } catch (error) {
//             console.error("IP location error:", error);
//             // Fallback to hardcoded location if all else fails
//             this.getWeather(28.67, 77.22);
//             this.setState({
//                 error: "Could not determine your location. Showing default weather data.",
//                 loading: false
//             });
//         }
//     };

//     getPosition = (options) => {
//         return new Promise(function (resolve, reject) {
//             navigator.geolocation.getCurrentPosition(resolve, reject, options);
//         });
//     };

//     mapIcon = (description) => {
//         switch (description) {
//             case "Clear": return "CLEAR_DAY";
//             case "Clouds": return "CLOUDY";
//             case "Rain": return "RAIN";
//             case "Snow": return "SNOW";
//             case "Thunderstorm": return "WIND";
//             case "Drizzle": return "SLEET";
//             default: return "PARTLY_CLOUDY_DAY";
//         }
//     };

//     getWeather = async (lat, lon) => {
//         try {
//             const api_call = await fetch(
//                 `${apiKeys.base}weather?lat=${lat}&lon=${lon}&units=metric&APPID=${apiKeys.key}`
//             );
//             const data = await api_call.json();

//             if (data.cod !== 200) {
//                 throw new Error(data.message || "Failed to fetch weather data");
//             }

//             this.setState({
//                 lat: lat,
//                 lon: lon,
//                 city: data.name,
//                 temperatureC: Math.round(data.main.temp),
//                 humidity: data.main.humidity,
//                 windSpeed: data.wind.speed,
//                 windDirection: data.wind.deg,
//                 main: data.weather[0].main,
//                 country: data.sys.country,
//                 rainfall: data.rain ? data.rain["1h"] || data.rain["3h"] || 0 : 0,
//                 icon: this.mapIcon(data.weather[0].main),
//                 loading: false,
//                 error: null
//             });

//             if (this.props.onWeatherUpdate) {
//                 this.props.onWeatherUpdate({
//                     temperature: Math.round(data.main.temp),
//                     humidity: data.main.humidity,
//                     windSpeed: data.wind.speed,
//                     windDirection: data.wind.deg,
//                     rainfall: data.rain ? data.rain["1h"] || data.rain["3h"] || 0 : 0,
//                 });
//             }
//         } catch (error) {
//             console.error("Weather fetch error:", error);
//             this.setState({
//                 loading: false,
//                 error: "Failed to fetch weather data. Please try again later."
//             });
//         }
//     };

//     render() {
//         const { loading, error, city, country, icon, main, temperatureC, humidity, windSpeed, windDirection, rainfall } = this.state;

//         if (loading) {
//             return (
//                 <div className="city" style={{ color: "Green", fontFamily: "Times New Roman", alignItems: 'center' }}>
//                     <p>Loading weather data...</p>
//                 </div>
//             );
//         }

//         if (error) {
//             return (
//                 <div className="city" style={{ color: "Green", fontFamily: "Times New Roman", alignItems: 'center' }}>
//                     <p style={{ color: "red" }}>{error}</p>
//                 </div>
//             );
//         }

//         return (
//             <div className="city" style={{ color: "Green", fontFamily: "Times New Roman", alignItems: 'center' }}>
//                 <div className="title">
//                     <h2>{city}</h2>
//                     <h3>{country}</h3>
//                 </div>
//                 <div className="mb-icon">
//                     <ReactAnimatedWeather
//                         icon={icon}
//                         color={defaults.color}
//                         size={defaults.size}
//                         animate={defaults.animate}
//                     />
//                     <p>{main}</p>
//                 </div>
//                 <div className="date-time">
//                     <div className="dmy">
//                         <div className="current-time">
//                             <Clock format="HH:mm:ss" interval={1000} ticking={true} />
//                         </div>
//                         <div className="current-date">
//                             {dateBuilder(new Date())}
//                         </div>
//                     </div>
//                     <div className="temperature" style={{ textAlign: 'left' }}>
//                         <p>Temperature: {temperatureC}°<span>C</span></p>
//                         <p>Humidity: {humidity}%</p>
//                         <p>Wind Speed: {windSpeed} m/s</p>
//                         <p>Wind Direction: {windDirection}°</p>
//                         <p>Rainfall: {rainfall} mm</p>
//                     </div>
//                 </div>
//             </div>
//         );
//     }
// }

// export default Weather;









import './CurrentLocation.css';
import React, { Component } from 'react';
import Clock from 'react-live-clock';
import ReactAnimatedWeather from 'react-animated-weather';
import apiKeys from '../apiKeys'; // make sure base and key are set
import Prediction from './Prediction';
const dateBuilder = (d) => {
    const months = [
        "January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"
    ];
    const days = [
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ];
    const day = days[d.getDay()];
    const date = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day}, ${date} ${month} ${year}`;
};

const defaults = {
    color: "white",
    size: 112,
    animate: true,
};

class Weather extends Component {
    state = {
        lat: null,
        lon: null,
        city: null,
        country: null,
        temperatureC: null,
        humidity: null,
        windSpeed: null,
        windDirection: null,
        main: null,
        icon: "CLEAR_DAY",
        rainfall: null,
        loading: true,
        error: null,
        forecast: [], // for next 7 days
        mlPrediction: [], // for ML model prediction
    };

    componentDidMount() {
        this.getLocation();
        this.timerID = setInterval(() => {
            if (this.state.lat && this.state.lon) {
                this.getWeather(this.state.lat, this.state.lon);
            }
        }, 300000);
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.getWeather(position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    this.setState({ error: "Geolocation failed. Using default." });
                    this.getWeatherByIP();
                }
            );
        } else {
            this.setState({ error: "Geolocation not supported." });
            this.getWeatherByIP();
        }
    };

    // getWeatherByIP = async () => {
    //     try {
    //         const ipRes = await fetch('https://ipapi.co/json/');
    //         const ipData = await ipRes.json();
    //         this.getWeather(ipData.latitude, ipData.longitude);
    //     } catch {
    //         this.getWeather(28.67, 77.22); // fallback
    //     }
    // };
    getWeatherByIP = async () => {
        try {
            const response = await fetch('http://api.ipstack.com/check?access_key=7Z8C1Ww0ncUintqmtWEMFVoi4aG05wQt');
            const data = await response.json();
            console.log("IP-Based Location:", data.latitude, data.longitude);
            this.getWeather(data.latitude, data.longitude);
        } catch (error) {
            console.error("IP location error:", error);
            this.getWeather(28.67, 77.22); // Fallback to default location
        }
    };

    mapIcon = (conditionText) => {
        if (conditionText.includes("rain")) return "RAIN";
        if (conditionText.includes("cloud")) return "CLOUDY";
        if (conditionText.includes("snow")) return "SNOW";
        if (conditionText.includes("sun")) return "CLEAR_DAY";
        return "PARTLY_CLOUDY_DAY";
    };

    sendForecastToMLModel = async (forecast, crop) => {
        try {
            const response = await fetch('http://localhost:5000/api/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ forecast, crop }),
            });
            const result = await response.json();
            console.log('ML Prediction:', result.results); // Debugging log
            this.setState({ mlPrediction: result.results });
        } catch (error) {
            console.error('Error sending forecast to ML model:', error);
            this.setState({ mlPrediction: [] }); // Set to empty array on error
        }
    };

    sendPredictionToUser = async (phoneNumber) => {
        const { mlPrediction } = this.state;

        if (!mlPrediction || mlPrediction.length === 0) {
            alert("No prediction data available to send.");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/send-prediction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phone_number: phoneNumber,
                    prediction: mlPrediction,
                }),
            });

            const result = await response.json();
            if (response.ok) {
                alert(result.message);
            } else {
                alert(`Failed to send prediction: ${result.error}`);
            }
        } catch (error) {
            console.error('Error sending prediction:', error);
            alert('An error occurred while sending the prediction.');
        }
    };
    getWeather = async (lat, lon) => {
        try {
            const url = `${apiKeys.base}forecast.json?key=${apiKeys.key}&q=${lat},${lon}&days=7&aqi=no&alerts=no`;
            const res = await fetch(url);
            const data = await res.json();

            const current = data.current;
            const location = data.location;
            const forecast = data.forecast.forecastday;

            this.setState({
                lat,
                lon,
                city: location.name,
                country: location.country,
                temperatureC: current.temp_c,
                humidity: current.humidity,
                windSpeed: current.wind_kph,
                windDirection: current.wind_degree,
                main: current.condition.text,
                icon: this.mapIcon(current.condition.text.toLowerCase()),
                rainfall: current.precip_mm,
                forecast: forecast,
                loading: false,
                error: null,
                mlPrediction: []
            });

            // Send forecast to ML model
            this.sendForecastToMLModel(forecast);

        } catch (err) {
            console.error(err);
            this.setState({ error: "Failed to fetch data", loading: false });
        }
    };


    renderWeatherForecast = () => {
        return (
            <div className="forecast">
                <h4>Next 7 Days Forecast 🌤️</h4>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {this.state.forecast.map((day) => (
                        <li key={day.date} style={{ marginBottom: "10px" }}>
                            <strong>{day.date}:</strong> {day.day.condition.text} | 🌡️ {day.day.avgtemp_c}°C | 💧 {day.day.daily_chance_of_rain}% rain
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    render() {
        const {
            loading, error, city, country, icon, main, temperatureC,
            humidity, windSpeed, windDirection, rainfall, mlPrediction
        } = this.state;

        if (loading) return <p>Loading weather...</p>;
        if (error) return <p style={{ color: 'red' }}>{error}</p>;

        return (
            <div className="city" style={{ color: "Green", fontFamily: "Times New Roman" }}>
                <div className="title">
                    <h2>{city}</h2>
                    <h3>{country}</h3>
                </div>
                <div className="mb-icon">
                    <ReactAnimatedWeather icon={icon} {...defaults} />
                    <p>{main}</p>
                </div>
                <div className="date-time">
                    <div className="dmy">
                        <Clock format="HH:mm:ss" interval={1000} ticking={true} />
                        <div className="current-date">{dateBuilder(new Date())}</div>
                    </div>
                    <div className="temperature" style={{ textAlign: 'left' }}>
                        <p>Temperature: {temperatureC}°C</p>
                        <p>Humidity: {humidity}%</p>
                        <p>Wind Speed: {windSpeed} km/h</p>
                        <p>Wind Direction: {windDirection}°</p>
                        <p>Rainfall: {rainfall} mm</p>
                    </div>
                </div>
                {this.renderForecast()}
                <button
                    onClick={() => {
                        const phoneNumber = prompt("Enter the phone number to send the prediction:");
                        if (phoneNumber) {
                            this.sendPredictionToUser(phoneNumber);
                        }
                    }}
                >
                    Send Prediction via SMS
                </button>
                {this.renderWeatherForecast()}
            </div>
        );
    }



    renderForecast = () => {
        const { mlPrediction } = this.state;

        if (!mlPrediction || mlPrediction.length === 0) {
            return <p>No prediction data available.</p>;
        }

        return (
            <div className="weatherforecast">
                <h4>Crop Suitability Prediction:</h4>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {mlPrediction.map((day, index) => (
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
}


export default Weather;

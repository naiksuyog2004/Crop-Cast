
import './CurrentLocation.css';
import React, { Component } from 'react';
import Clock from 'react-live-clock';
import ReactAnimatedWeather from 'react-animated-weather';
import apiKeys from '../apiKeys'; // make sure base and key are set

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


    getLocation = async () => {
        const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage

        if (!userId) {
            console.error("User ID not found in localStorage.");
            this.setState({ error: "User ID not found. Please log in again." });
            return;
        }

        try {
            // Fetch district name from MongoDB via backend
            const response = await fetch('http://localhost:5000/api/get-district', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }),
            });

            const result = await response.json();

            if (response.ok && result.district) {
                console.log("District fetched from DB:", result.district);

                // Fetch weather data for the district
                this.getWeatherByDistrict(result.district);
            } else {
                console.error("Failed to fetch district:", result.error || "Unknown error");
                this.setState({ error: "Failed to fetch district. Using default location." });
                this.getWeatherByIP(); // Fallback to IP-based location
            }
        } catch (error) {
            console.error("Error fetching district:", error);
            this.setState({ error: "Error fetching district. Using default location." });
            this.getWeatherByIP(); // Fallback to IP-based location
        }
    };


    mapIcon = (conditionText) => {
        if (conditionText.includes("rain")) return "RAIN";
        if (conditionText.includes("cloud")) return "CLOUDY";
        if (conditionText.includes("snow")) return "SNOW";
        if (conditionText.includes("sun")) return "CLEAR_DAY";
        return "PARTLY_CLOUDY_DAY";
    };



    sendForecastToMLModel = async (forecast) => {
        const userId = localStorage.getItem('userId');
        try {
            const response = await fetch('http://localhost:5000/api/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, forecast }),
            });
            const result = await response.json();
            console.log('ML Prediction:', result.results); // Debugging log

            // Ensure result.results is an array
            if (Array.isArray(result.results)) {
                this.setState({ mlPrediction: result.results });
            } else {
                console.error('Invalid response format: results is not an array');
                this.setState({ mlPrediction: [] });
            }
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


    getWeatherByDistrict = async (district) => {
        try {
            // Use the district name to fetch weather data
            const url = `${apiKeys.base}forecast.json?key=${apiKeys.key}&q=${district}&days=7&aqi=no&alerts=no`;
            const res = await fetch(url);
            const data = await res.json();

            const current = data.current;
            const location = data.location;
            const forecast = data.forecast.forecastday;

            this.setState({
                lat: location.lat,
                lon: location.lon,
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
                mlPrediction: [],
            });

            // Send forecast to ML model
            this.sendForecastToMLModel(forecast);
        } catch (err) {
            console.error("Error fetching weather by district:", err);
            this.setState({ error: "Failed to fetch weather data", loading: false });
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

                {this.renderWeatherForecast()}
            </div>
        );
    }


    renderForecast = () => {
        const { mlPrediction } = this.state;

        if (!Array.isArray(mlPrediction) || mlPrediction.length === 0) {
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

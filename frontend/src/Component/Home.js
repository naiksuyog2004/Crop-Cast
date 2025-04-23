// import React, { useState, useRef, useEffect } from 'react';

// import './Home.css';
// import Weather from '../features/CurrentLocation'
// import Footer from './footer/footer';
// import AboutUs from '../Component/AboutUs/AboutUs';
// import Navbar from './Navbar/Navbar';
// import { Link } from 'react-router-dom';
// const Home = ({ name }) => {
//     const [weatherData, setWeatherData] = useState(null);
//     const [Login, setLogin] = useState(true);

//     const [forecast, setForecast] = useState([]);
//     const [weatherNow, setWeatherNow] = useState(null);
//     const [showDropdown, setShowDropdown] = useState(false);
//     const openOption = () => {
//         setShowDropdown((prev) => !prev);
//     };

//     const handleOptionClick = (option, navigate) => {
//         console.log(option); // Handle option click logic here
//         setShowDropdown(false);
//         // Close dropdown after clicking an option

//     };
//     const handleAuth = () => {
//         setLogin(!Login);
//     };

//     return (
//         <div>
//             <div className="background"></div>

//             <div className="home-container">
//                 <header className="header">
//                     <h1>🌾 Crop Cast</h1>
//                     {/* <p>Check if the weather is suitable for your crops today!</p> */}
//                     <div className='nav-components'>
//                         <ul>
//                             <li><Dropdown /></li>
//                             <li>location</li>
//                             <li><Link to="/about">About Us</Link></li>

//                             <li>
//                                 <Link
//                                     to={Login ? "/" : "/login"} // Navigate to appropriate route
//                                     onClick={handleAuth} // Toggle login state
//                                 >
//                                     {Login ? "Logout" : "Login"} {/* Display based on state */}
//                                 </Link>
//                             </li>
//                             {/* <li>{!Login ? <Link to="/signup">Login</Link> : ''}</li> */}
//                             {console.log(Login)}
//                         </ul>
//                     </div>

//                     <div className="search-container">
//                         <input
//                             type="text"
//                             className="crop-input"
//                             placeholder="Enter crop name..."
//                         />
//                         <button className="search-button">Check Weather</button>
//                     </div>
//                     <div style={{ position: "relative" }}>
//                         {/* Profile Button */}
//                         <button className="symbol" onClick={openOption}>
//                             {name && Login ? `${name}` : ""}
//                         </button>

//                         {/* Dropdown Menu */}
//                         {showDropdown && (
//                             <ul
//                                 style={{
//                                     position: "absolute",
//                                     top: "100%",
//                                     right: 0,
//                                     marginTop: "8px",
//                                     padding: "10px",
//                                     borderRadius: "5px",
//                                     backgroundColor: "white",
//                                     boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//                                     zIndex: 1000,
//                                     listStyleType: "none",
//                                 }}
//                             >
//                                 <li
//                                     style={{
//                                         padding: "8px 12px",
//                                         cursor: "pointer",
//                                         borderBottom: "1px solid #eee",
//                                     }}
//                                     onClick={() => handleOptionClick("Profile")}
//                                 >
//                                     <Link style={{ color: 'inherit', textDecoration: 'none' }} to={"/userform"}>Profile</Link>
//                                 </li>
//                                 <li
//                                     style={{
//                                         padding: "8px 12px",
//                                         cursor: "pointer",
//                                         borderBottom: "1px solid #eee",
//                                     }}
//                                     onClick={() => handleOptionClick("Settings")}
//                                 >
//                                     Settings
//                                 </li>
//                                 <li
//                                     style={{ padding: "8px 12px", cursor: "pointer" }}
//                                     onClick={() => handleOptionClick("Logout")}
//                                     replace
//                                 >
//                                     <Link style={{ color: 'inherit', textDecoration: 'none' }} to={"/login"} >Logout</Link>
//                                 </li>
//                             </ul>
//                         )}
//                     </div>
//                 </header>
//                 {
//                     Login ?
//                         <>
//                             <div className="side-component">
//                                 <div className="weather-info">
//                                     <h2>Today's Weather</h2>
//                                     <Weather onWeatherUpdate={(data) => setWeatherNow(data)} onForecastUpdate={(forecastData) => setForecast(forecastData)} />
//                                 </div>


//                                 <div className='sidebar'>
//                                     <div className='newtext'>
//                                         <h1 className='heading'>Empower Your Farming with Timely Weather Alerts</h1>
//                                         <h3 className='content'>Stay informed about weather conditions that could impact your crops. </h3>
//                                         <h3 className='content'>CropCast helps you protect your harvest with real-time,</h3>
//                                         <h3 className='content'>SMS alerts tailored to your city.</h3>
//                                     </div>
//                                     {
//                                         Login ? <div className="App">
//                                             {/* <h2>Prediction</h2> */}
//                                             {/* <Prediction prediction={mlPrediction} /> */}
//                                         </div> : ""

//                                     }

//                                 </div>
//                             </div>
//                         </> : <Text />}

//             </div>


//             <Footer />
//         </div>
//     );
// };

// export default Home;

// const Dropdown = () => {
//     const [isDropdownOpen, setDropdownOpen] = useState(false);
//     const dropdownRef = useRef(null);

//     const toggleDropdown = () => {
//         setDropdownOpen(!isDropdownOpen);
//     };

//     const handleClickOutside = (event) => {
//         if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//             setDropdownOpen(false);
//         }
//     };

//     useEffect(() => {
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => {
//             document.removeEventListener("mousedown", handleClickOutside);
//         };
//     }, []);

//     return (
//         <div className="dropdown-container" ref={dropdownRef}>
//             <button className="dropdown-button" onClick={toggleDropdown}>
//                 Crop Info
//             </button>
//             {isDropdownOpen && (
//                 <ul className="dropdown-menu">
//                     <li>
//                         <Link to="/rice">Rice</Link>
//                     </li>
//                     <li>
//                         <Link to="/wheat">Wheat</Link>
//                     </li>
//                     <li>
//                         <Link to="/sugarcane">Sugarcane</Link>
//                     </li>
//                 </ul>
//             )}
//         </div>
//     );
// };




// const Text = () => {
//     return (
//         <div className='text'>
//             <h1 className='heading'>Empower Your Farming with Timely Weather Alerts</h1>
//             <h3 className='content'>Stay informed about weather conditions that could impact your crops. </h3>
//             <h3 className='content'>CropCast helps you protect your harvest with real-time,</h3>
//             <h3 className='content'>SMS alerts tailored to your city.</h3>
//         </div>
//     )
// }







import React, { useState } from 'react';
import './Home.css';
import Weather from '../features/CurrentLocation';
import Footer from './footer/footer';
import Navbar from './Navbar/Navbar';

const Home = ({ name }) => {
    const [Login, setLogin] = useState(true);
    const [forecast, setForecast] = useState([]);
    const [weatherNow, setWeatherNow] = useState(null);

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
        </div>
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


import './App.css';
import Home from './Component/Home';
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import axios from 'axios';
import Rice from "./Component/Cropinfo/Rice";
import Wheat from './Component/Cropinfo/Wheat';
import Sugarcane from './Component/Cropinfo/Sugarcane';
import AboutUs from './Component/AboutUs/AboutUs';
import PhoneLogin from './Component/Auth/PhoneLogin';
import UsernameLogin from './Component/Auth/UsernameLogin';
import CompleteProfile from './Component/Auth/CompleteProfile';
import Dashboard from './Component/Dashboard';

function App() {
  const [Login, setLogin] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        // First, check if the username is already in localStorage
        const storedUsername = localStorage.getItem('username');

        if (storedUsername) {
          setUserName(storedUsername); // Set the username from localStorage

          console.log("Username retrieved from localStorage:", storedUsername);
          return;
        }

        // If username is not in localStorage, fetch it using userId
        const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage
        if (!userId) {
          console.error("No userId found in localStorage");
          return;
        }

        const response = await axios.get(`http://localhost:5001/api/auth/profile/${userId}`); // Call backend API
        const fetchedUsername = response.data.user.username;


        setUserName(fetchedUsername); // Set the username in state

        localStorage.setItem('username', fetchedUsername); // Store username in localStorage

        console.log("Fetched and stored username:", fetchedUsername);


      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };


    fetchUsername();

  }, []);

  const handleAuth = () => {
    setLogin(!Login);
  };

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home name={userName} Login={Login} handleAuth={handleAuth} />} />
          <Route path="/rice" element={<Rice />} />
          <Route path='/wheat' element={<Wheat />} />
          <Route path='/sugarcane' element={<Sugarcane />} />
          <Route path="/about" element={<AboutUs name={userName} Login={Login} handleAuth={handleAuth} />} />
          <Route path="/login" element={<PhoneLogin />} />
          <Route path="/signup" element={<UsernameLogin />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
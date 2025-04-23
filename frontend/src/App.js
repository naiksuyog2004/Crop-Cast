import './App.css';
import Home from './Component/Home';
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import axios from 'axios'; // Import axios for API calls
import Rice from "./Component/Cropinfo/Rice";
import Wheat from './Component/Cropinfo/Wheat';
import Sugarcane from './Component/Cropinfo/Sugarcane';
import UserForm from './Component/UserForm/userForm';
import AboutUs from './Component/AboutUs/AboutUs';
import PhoneLogin from './Component/Auth/PhoneLogin';
import UsernameLogin from './Component/Auth/UsernameLogin';
import CompleteProfile from './Component/Auth/CompleteProfile';
import Dashboard from './Component/Dashboard';

function App() {
  const [Login, setLogin] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage
        if (!token) {
          console.error("No token found in localStorage");
          return;
        }

        const response = await axios.get('http://localhost:5001/api/user', {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        });

        setUserName(response.data.username); // Set the username in state
        console.log("Fetched username:", response.data.username); // Debugging log
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
          <Route path='/userform' element={<UserForm />} />
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
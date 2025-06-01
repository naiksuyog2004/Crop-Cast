import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { removeUser, setUser } from '../utils/auth';
import axios from 'axios';
import './Dashboard.css';
import cities from './Maharashtra-Cities/maharashtraCities.json';
const crops = ['Wheat', 'Rice', 'Maize', 'Jowar', 'Bajra', 'Tur', 'Gram', 'Soybean', 'Sugarcane', 'Cotton'];


const Dashboard = () => {
  const [user, setUserState] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const [districts] = useState(cities.cities);
  const [showAllDistricts, setShowAllDistricts] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem('userId'); // Retrieve user_id from localStorage
      if (!userId) return navigate('/login'); // Redirect to login if no user_id is found

      try {
        const response = await axios.get(`http://localhost:5001/api/profile/${userId}`); // Fetch user data from backend
        if (response.data?.success) {
          const userData = response.data.user;
          setUserState(userData);
          setFormData(userData);
          setUser(userData); // Save user data in localStorage
        } else {
          navigate('/login'); // Redirect to login if user data is not found
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/login'); // Redirect to login on error
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    removeUser();
    navigate('/login');
  };
  const handleBack = () => {
    navigate('/');
  }
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSeeMore = () => {
    setShowAllDistricts(true);
  };
  const handleUpdate = async () => {
    try {
      const response = await axios.put(`http://localhost:5001/api/profile/${user._id}`, formData); // Update user data in MongoDB
      if (response.data?.success) {
        const updatedUser = response.data.user;
        setUser(updatedUser); // Update localStorage with the new user data
        setUserState(updatedUser); // Update the state with the new user data
        setEditMode(false); // Exit edit mode
        alert('Profile updated successfully!'); // Notify the user
      } else {
        alert('Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Update failed:', error);
      alert('An error occurred while updating the profile.');
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <>
      <div className="aboutbackground"></div>
      <div className="dashboard">
        <h1>Welcome, {user.firstName || user.username}</h1>
        <button onClick={handleBack}>Back</button>
        <button onClick={handleLogout}>Logout</button>
        <div className="profile-info">
          {editMode ? (
            <>
              <input name="firstName" value={formData.firstName || ''} onChange={handleChange} />
              <input name="lastName" value={formData.lastName || ''} onChange={handleChange} />
              <input name="username" value={formData.username || ''} onChange={handleChange} />
              <select name="crop" value={formData.crop || ''} onChange={handleChange}>
                <option value="">Select Crop</option>
                {crops.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select name="city" value={formData.district || ''} onChange={handleChange}>
                <option value="">Select nearest city</option>
                {districts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <button onClick={handleUpdate}>Save</button>
            </>
          ) : (
            <>
              <p><strong>First Name:</strong> {user.firstName}</p>
              <p><strong>Last Name:</strong> {user.lastName}</p>
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>Crop:</strong> {user.crop}</p>
              <p><strong>City:</strong> {user.district}</p>
              <button onClick={() => setEditMode(true)}>Edit</button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
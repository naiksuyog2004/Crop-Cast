import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, removeUser, setUser } from '../utils/auth';
import axios from 'axios';

const crops = ['Wheat', 'Rice', 'Jowar', 'Bajra', 'Tur', 'Gram', 'Soybean', 'Sugarcane', 'Cotton'];
const districts = ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur', 'Amravati', 'Kolhapur', 'Satara'];

const Dashboard = () => {
  const [user, setUserState] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const userData = getUser();
    if (!userData) return navigate('/username-login');
    setUserState(userData);
    setFormData(userData);
  }, [navigate]);

  const handleLogout = () => {
    removeUser();
    navigate('/username-login');
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`http://localhost:5001/api/profile/${user._id}`, formData);
      if (response.data?.success) {
        // const updatedUser = response.data.user;
        setUser(response.data.user);
        setUserState(response.data.user);
        setEditMode(false);
      }
    } catch (error) {
      console.error('Update failed', error);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="dashboard">
      <h1>Welcome, {user.firstName || user.username}</h1>
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
            <select name="district" value={formData.district || ''} onChange={handleChange}>
              <option value="">Select District</option>
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
            <p><strong>District:</strong> {user.district}</p>
            <button onClick={() => setEditMode(true)}>Edit</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

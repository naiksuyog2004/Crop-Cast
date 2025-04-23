import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { setUser } from '../../utils/auth';

const crops = ['Wheat', 'Rice', 'Jowar', 'Bajra', 'Tur', 'Gram', 'Soybean', 'Sugarcane', 'Cotton'];
const districts = ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur', 'Amravati', 'Kolhapur', 'Satara'];

const CompleteProfile = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    crop: '',
    district: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const { userId } = location.state || {};

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { username, password, confirmPassword, firstName, lastName, crop, district } = formData;

    if (password !== confirmPassword) return setError('Passwords do not match');
    if (!userId) return setError('User ID not found');

    try {
      const response = await axios.post('http://localhost:5001/api/complete-profile', {
        userId, username, password, firstName, lastName, crop, district
      });

      if (response.data?.success) {
        setUser(response.data.user);
        navigate('/');
      } else {
        setError('Profile completion failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error completing profile');
    }
  };

  return (
    <div className="auth-container1">
      <div className="auth-card1">
        <h2>Complete Your Profile</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required />
          <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required />
          <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required />
          <select name="crop" value={formData.crop} onChange={handleChange} required>
            <option value="">Select Crop</option>
            {crops.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select name="district" value={formData.district} onChange={handleChange} required>
            <option value="">Select District</option>
            {districts.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <button type="submit">Complete Profile</button>
        </form>
        {error && <div className="error-message1">{error}</div>}
      </div>
    </div>
  );
};

export default CompleteProfile;

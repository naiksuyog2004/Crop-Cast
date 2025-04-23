import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../../utils/auth';
// Assuming you have a CSS file for styling
const UsernameLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/login', {
        username,
        password
      });
      if (response.data.success) {
        setUser(response.data.user); // save to localStorage
        navigate('/');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="auth-container1">
      <div className="auth-card1">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group1">
            <label>Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="form-group1">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit">Login</button>
          <p>Don't have an account? <a href="/login">Sign Up with Phone</a></p>
        </form>
        {error && <div className="error-message">{error}</div>}
      </div>
      x

    </div>
  );
};

export default UsernameLogin;

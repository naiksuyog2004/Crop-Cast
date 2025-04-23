import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../utils/auth';

const Welcome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = getUser();
    if (user) navigate('/dashboard');
  }, [navigate]);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome</h2>
        <button onClick={() => navigate('/username-login')}>Login</button>
        <button onClick={() => navigate('/phone-login')}>Sign Up</button>
      </div>
    </div>
  );
};

export default Welcome;

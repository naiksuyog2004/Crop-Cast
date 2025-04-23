import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setUser } from '../../utils/auth';
import './PhoneLogin.css'; // Assuming you have a CSS file for styling
const PhoneLogin = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState('send');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:5001/api/send-verification', {
        phoneNumber: `+91${phoneNumber}`
      });
      if (response.data?.success) {
        setStep('verify');
        setCountdown(30);
      } else {
        throw new Error('Failed to send verification code');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:5001/api/verify-code', {
        phoneNumber: `+91${phoneNumber}`,
        code
      });

      if (response.data?.success) {
        const { userId, hasPassword, user } = response.data;
        setUser(user);

        if (hasPassword) {
          navigate('/dashboard');
        } else {
          navigate('/complete-profile', { state: { userId } });
        }
      } else {
        throw new Error(response.data?.message || 'Verification failed');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="auth-container1">
      <div className="auth-card1">
        <h2>Sign Up with Phone</h2>
        {step === 'send' ? (
          <form onSubmit={handleSendCode}>
            <div className="form-group1">
              <label>Phone Number</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="9876543210"
                pattern="[6-9]\d{9}"
                required
              />
            </div>
            <button type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send Code'}</button>
            <p>Already have an account? <a href="/signup">Login with Username</a></p>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode}>
            <div className="form-group1">
              <label>Verification Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="6-digit code"
                required
              />
            </div>
            <button type="submit" disabled={loading}>{loading ? 'Verifying...' : 'Verify Code'}</button>
            {countdown > 0 ? (
              <p>Resend in {countdown}s</p>
            ) : (
              <button type="button" onClick={handleSendCode}>Resend</button>
            )}

          </form>
        )}
        {error && <div className="error-message1">{error}</div>}
      </div>


    </div>

  );
};

export default PhoneLogin;

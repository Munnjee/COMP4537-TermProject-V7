import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/authService';
import messages from '../../utils/messages';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate email
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/auth/forgot-password', { email });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || messages.SERVER_ERROR);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1>Forgot Password</h1>
      
      {success ? (
        <div className="success-message">
          <p>Password reset email sent! Check your inbox for instructions.</p>
          <p>
            <Link to="/login">Back to Login</Link>
          </p>
        </div>
      ) : (
        <>
          {error && <div className="alert alert-danger">{error}</div>}
          
          <p className="info-text">
            Enter your email address and we'll send you a link to reset your password.
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={loading}
                required
              />
            </div>
            
            <button type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
          
          <p>
            <Link to="/login">Back to Login</Link>
          </p>
        </>
      )}
    </div>
  );
};

export default ForgotPassword;

// Attribution: ChatGPT was used for structure and organization of the code and Copilot was used to assist in writing the code.
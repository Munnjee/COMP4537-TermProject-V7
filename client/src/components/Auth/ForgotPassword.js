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
      setError(messages.EMAIL_REQUIRED);
      return;
    }

    if (!validateEmail(email)) {
      setError(messages.INVALID_EMAIL);
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
          <p>{messages.PASSWORD_RESET_EMAIL_SENT}</p>
          <p>
            <Link to="/login">{messages.RETURN_LOGIN}</Link>
          </p>
        </div>
      ) : (
        <>
          {error && <div className="alert alert-danger">{error}</div>}
          
          <p className="info-text">
            {messages.RESET_PASSWORD_INFO}
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">{messages.EMAIL}</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={messages.EMAIL_PLACEHOLDER}
                disabled={loading}
                required
              />
            </div>
            
            <button className="home-button" type="submit" disabled={loading}>
              {loading ? messages.SENDING : messages.SEND_RESET_LINK}
            </button>
          </form>
          
          <p>
            <Link to="/login">{messages.RETURN_LOGIN}</Link>
          </p>
        </>
      )}
    </div>
  );
};

export default ForgotPassword;

// Attribution: ChatGPT was used for structure and organization of the code and Copilot was used to assist in writing the code.
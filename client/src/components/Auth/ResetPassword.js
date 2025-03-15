import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/authService';
import messages from '../../utils/messages';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const { token } = useParams();
  const navigate = useNavigate();
  
  const { password, confirmPassword } = formData;

  // Verify token on component mount
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await api.get(`/auth/verify-reset-token/${token}`);
        setTokenValid(true);
      } catch (err) {
        setError('This password reset link is invalid or has expired.');
        setTokenValid(false);
      } finally {
        setVerifying(false);
      }
    };

    verifyToken();
  }, [token]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (password.length < 3) {
      setError('Password must be at least 3 characters long');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await api.post(`/auth/reset-password/${token}`, { password });
      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || messages.SERVER_ERROR);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while verifying token
  if (verifying) {
    return (
      <div className="login-container">
        <h1>Reset Password</h1>
        <div className="loading-message">Verifying reset link...</div>
      </div>
    );
  }

  // Show error if token is invalid
  if (!tokenValid) {
    return (
      <div className="login-container">
        <h1>Reset Password</h1>
        <div className="alert alert-danger">{error}</div>
        <p>
          <Link to="/forgot-password">Request a new password reset link</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="login-container">
      <h1>Reset Password</h1>
      
      {success ? (
        <div className="success-message">
          <p>Password has been reset successfully!</p>
          <p>Redirecting to login page...</p>
        </div>
      ) : (
        <>
          {error && <div className="alert alert-danger">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="password">New Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={onChange}
                placeholder="Enter your new password"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={onChange}
                placeholder="Confirm your new password"
                required
              />
            </div>
            
            <button type="submit" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
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

export default ResetPassword;

// Attribution: ChatGPT was used for structure and organization of the code and Copilot was used to assist in writing the code.
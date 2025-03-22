import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../../services/authService";
import messages from "../../utils/messages";

const Register = ({ setUser }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { firstName, email, password, confirmPassword } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (!firstName || !email || !password) {
      setError(messages.REQUIRED_FIELD);
      return;
    }

    if (!validateEmail(email)) {
      setError(messages.INVALID_EMAIL);
      return;
    }

    if (password.length < 3) {
      setError(messages.PASSWORD_LENGTH);
      return;
    }

    if (password !== confirmPassword) {
      setError(messages.PASSWORDS_DO_NOT_MATCH);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await register({ firstName, email, password });
      setUser(data.user);
      navigate("/");
    } catch (err) {
      setError(err.message || messages.REGISTRATION_FAILED);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h1>{messages.REGISTER}</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="firstName">{messages.USER_NAME}</label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            value={firstName}
            onChange={onChange}
            placeholder= {messages.USER_NAME_PLACEHOLDER}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">{messages.EMAIL}</label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={onChange}
            placeholder={messages.EMAIL_PLACEHOLDER}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">{messages.PASSWORD}</label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={onChange}
            placeholder={messages.PASSWORD_PLACEHOLDER}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">{messages.CONFIRM_PASSWORD}</label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            value={confirmPassword}
            onChange={onChange}
            placeholder={messages.CONFIRM_PASSWORD_PLACEHOLDER}
            required
          />
        </div>
        <button className="home-button" type="submit" disabled={loading}>
          {loading ? messages.REGISTERING : messages.REGISTER}
        </button>
      </form>
      <p>
        {messages.ALREADY_REGISTERED} <Link to="/login">{messages.LOGIN}</Link>
      </p>
    </div>
  );
};

export default Register;

// Attribution: ChatGPT was used for structure and organization of the code and Copilot was used to assist in writing the code.
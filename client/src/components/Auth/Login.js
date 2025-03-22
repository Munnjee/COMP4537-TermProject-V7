import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../../services/authService";
import messages from "../../utils/messages";
import "./Auth.css";

const Login = ({ setUser }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (!email || !password) {
      setError(messages.REQUIRED_FIELD);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await login({ email, password });
      setUser(data.user);

      // Redirect based on role
      if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message || messages.LOGIN_FAILED);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={onSubmit}>
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
            placeholder= {messages.PASSWORD_PLACEHOLDER}
            required
          />
          <div className="forgot-password-link">
            <Link to="/forgot-password">{messages.FORGOT_PASSWORD}?</Link>
          </div>
        </div>
        <button className="home-button" type="submit" disabled={loading}>
          {loading ? messages.LOGGING_IN : messages.LOGIN}
        </button>
      </form>
      <p>
        {messages.REGISTER_INFO} <Link to="/register">{messages.REGISTER}</Link>
      </p>
    </div>
  );
};

export default Login;

// Attribution: ChatGPT was used for structure and organization of the code and Copilot was used to assist in writing the code.
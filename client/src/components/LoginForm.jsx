import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Form.css';
import { login as loginService } from '../services/authService';
import { useAuth } from '../context/AuthContext';

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";


  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

 
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const data = await loginService(formData);
      login(data);

      navigate(from, { replace: true });
      
    } catch (error) {
      setError(error.message || 'Invalid email or password.');
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Welcome Back!</h2>
         {error && <p className="error-text">{error}</p>}
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            // HIGHLIGHT END
            placeholder="Enter your password"
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
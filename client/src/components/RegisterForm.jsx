import React, { useState } from 'react';
import './Form.css';
import { register } from '../services/authService';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const validate = () => {
    const newErrors = {};
    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.';
    }
    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setErrors({});

    try {
      const data = await register(formData);
      
      console.log('Registration successful!', data);
      login(data);
      
      alert('Registration successful! You can now log in.');
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Failed to register:', error);
      setErrors({ api: error.message || 'An unexpected error occurred.' });
    }
  };


  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Create Your Account</h2>
        {errors.api && <p className="error-text">{errors.api}</p>}
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />
        </div>

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
          <button>sendOTP</button>
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
            required
          />
          {errors.password && <p className="error-text">{errors.password}</p>}
        </div>

        <button type="submit" className="submit-btn">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
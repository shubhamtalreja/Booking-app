import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Form.css';
import { login as loginService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';

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
    <div className="flex justify-center items-center py-10 px-4">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8 w-full max-w-md flex flex-col gap-6">
        <h2 className='text-2xl font-semibold text-center'>Welcome Back!</h2>
         {error && <p className="text-red-600 text-sm text-center">{error}</p>}
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className='text-sm font-medium'>Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500'
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className='text-sm font-medium'>Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            // HIGHLIGHT END
            placeholder="Enter your password"
            className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500'
            required
          />
        </div>

        {/* Submit */}
        <Button type="submit" className="w-full bg-slate-700 hover:bg-slate-800 text-white font-semibold py-2 rounded-md">
          Login
        </Button>

        {/* SignUp */}
        <div className='flex justify-center items-center'>
          Dont't have a acoount?
          <Button variant='link' className='cursor-pointer text-blue' onClick={() => navigate('/register')}>
            SignUp
          </Button>
        </div>

      </form>
    </div>
  );
};

export default LoginForm;
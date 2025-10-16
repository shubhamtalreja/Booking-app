import React, { useState } from 'react';
import './Form.css';
import { register } from '../services/authService';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from './ui/button';
import { generateOtp, validateOtp } from '@/services/otpService';

const VendorRegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    description: '',
    address: '',
    category: '',
    city: '',
    phone: '',
    imageUrls: []
  });
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState();
  const [submitButton, setSubmitButton] = useState(false);

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

  const handleGenerateOtp = async () => {
    const email = formData.email
    const response = await generateOtp({ email });
    if (response.message) {
      setShowOtpInput(true);
    } else {
      setShowOtpInput(false);
    }
    console.log(response);
  }

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  }

  const handleValidateOtp = async () => {
    const otpCreds = {
      email: formData.email,
      otp: otp
    }
    const verifyResponse = await validateOtp(otpCreds);
    if (verifyResponse.message) {
      setSubmitButton(true);
    } else {
      setSubmitButton(false);
    }
  }


  return (
<div className="flex justify-center items-center py-10 px-4">
  <form
    onSubmit={handleSubmit}
    className="bg-white shadow-md rounded-lg p-8 w-full max-w-md flex flex-col gap-6"
  >
    <h2 className="text-2xl font-semibold text-center">Create Your Account</h2>
    {errors.api && <p className="text-red-600 text-sm text-center">{errors.api}</p>}

    {/* Full Name */}
    <div className="flex flex-col gap-2">
      <label htmlFor="name" className="text-sm font-medium">Full Name</label>
      <input
        type="text"
        id="name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Enter your full name"
        required
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
      />
    </div>

    {/* Email + Send OTP */}
    <div className="flex flex-col gap-2">
      <label htmlFor="email" className="text-sm font-medium">Email Address</label>
      <input
        type="email"
        id="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Enter your email"
        required
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
      />
      {formData.email && (
        <div className="flex justify-end">
          <Button type="button" onClick={handleGenerateOtp} className="mt-1">
            Send OTP
          </Button>
        </div>
      )}
    </div>

    {/* OTP + Verify */}
    {showOtpInput && (
      <div className="flex flex-col gap-2">
        <label htmlFor="otp" className="text-sm font-medium">OTP</label>
        <input
          type="text"
          id="otp"
          name="otp"
          value={otp}
          onChange={handleOtpChange}
          maxLength={6}
          placeholder="Enter OTP"
          required
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
        />
        {otp && (
          <div className="flex justify-end">
            <Button type="button" onClick={handleValidateOtp} className="mt-1">
              Verify
            </Button>
          </div>
        )}
      </div>
    )}

    {/* Description */}
    <div className="flex flex-col gap-2">
      <label htmlFor="description" className="text-sm font-medium">Description</label>
      <input
        type="text"
        id="description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Enter a brief description"
        required
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
      />
    </div>
    
    {/* Address */}
    <div className="flex flex-col gap-2">
      <label htmlFor="address" className="text-sm font-medium">Address</label>
      <input
        type="text"
        id="address"
        name="address"
        value={formData.address}
        onChange={handleChange}
        placeholder="Enter your address"
        required
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
      />
    </div>

    {/* Category */}
    <div className="flex flex-col gap-2">
      <label htmlFor="category" className="text-sm font-medium">Category</label>
      <input
        type="text"
        id="category"
        name="category"
        value={formData.category}
        onChange={handleChange}
        placeholder="Enter your full name"
        required
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
      />
    </div>

    {/* Password */}
    <div className="flex flex-col gap-2">
      <label htmlFor="password" className="text-sm font-medium">Password</label>
      <input
        type="password"
        id="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Create a password"
        required
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
      />
      {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
    </div>

    {/* Submit */}
    <Button
      type="submit"
      disabled={!submitButton}
      className="w-full bg-slate-700 hover:bg-slate-800 text-white font-semibold py-2 rounded-md"
    >
      Register
    </Button>
  </form>
</div>

  );
};

export default VendorRegisterForm;
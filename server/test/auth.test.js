// server/tests/auth.test.js
const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/user.model');

// We need to build a mock express app to test the routes
// This is because we don't want to rely on the real server.js file
// which might have other side effects (like starting the scheduler)
const app = express();
app.use(express.json()); // Make sure body-parser is used
app.use('/api/auth', require('../routes/auth.routes'));
// You would also need to mount your centralized error handler here for full testing
// const errorHandler = require('../middleware/error.middleware');
// app.use(errorHandler);

// Describe is a way to group related tests
describe('Authentication Endpoints', () => {

  // Test case for successful user registration
  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'client'
      });

    // Assertions: We check the response to see if it's what we expect
    expect(res.statusCode).toEqual(201); // 201 Created
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('token'); // A JWT should be returned
    
    // Optional: Check the database directly
    const user = await User.findOne({ email: 'test@example.com' });
    expect(user).not.toBeNull();
    expect(user.name).toBe('Test User');
  });

  // Test case for user login
  it('should log in an existing user successfully', async () => {
    // Arrange: First, create a user to log in with.
    const user = new User({
        name: 'Login User',
        email: 'login@example.com',
        password: 'password123',
    });
    await user.save(); // The pre-save hook will hash the password

    // Act: Attempt to log in
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'login@example.com',
        password: 'password123'
      });
      
    // Assert: Check for a successful response
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('token');
  });

  // Test case for failed login with wrong password
  it('should fail to log in with an incorrect password', async () => {
    // Arrange: Create a user
    const user = new User({
        name: 'Login User',
        email: 'wrongpass@example.com',
        password: 'password123',
    });
    await user.save();

    // Act: Attempt to log in with the wrong password
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'wrongpass@example.com',
        password: 'wrongpassword'
      });
      
    // Assert: Check for an unauthorized error
    // Note: Your error handler might send 401 or 400, adjust as needed.
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body.message).toBe('Invalid credentials'); // Match your error message
  });
});
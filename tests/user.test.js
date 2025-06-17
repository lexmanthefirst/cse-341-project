require('dotenv').config({ path: '.env.test' });
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

jest.setTimeout(10000);

// Mock user data
const testUser = {
  name: 'Test User',
  email: 'test@admin.school.com',
  password: 'wonder123',
  role: 'admin',
};

// Create test token
const token = jwt.sign(
  { id: 'testUserId', email: testUser.email, role: testUser.role },
  process.env.JWT_SECRET || 'testsecret',
  { expiresIn: '1h' },
);

// Mock Redis client
jest.mock('../config/redisClient', () => ({
  connect: jest.fn(),
  on: jest.fn(),
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn().mockResolvedValue('OK'),
  quit: jest.fn(),
}));

beforeAll(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI_TEST, {
      serverSelectionTimeoutMS: 5000,
    });

    // Clear existing data and create test user
    await User.deleteMany({});
    await User.create(testUser);
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.disconnect();
});

describe('User Routes', () => {
  it('should get all users', async () => {
    const res = await request(app)
      .get('/api/user')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    // Check for proper response structure
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBeTruthy();
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('should get a user by ID', async () => {
    const user = await User.findOne({ email: 'test@admin.school.com' });
    const res = await request(app)
      .get(`/api/user/${user._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    // Check for proper response structure
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('name', user.name);
    expect(res.body.data).toHaveProperty('email', user.email);
  });
});

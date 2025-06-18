require('dotenv').config({ path: '.env.test' });
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');
const Department = require('../models/departmentModel');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

jest.setTimeout(10000);

// Mock department data
const testDepartment = {
  name: 'Test Department',
  description: 'This is a test department',
  head: null, // Will be set after creating a test user
};

// Test user data
const testUser = {
  name: 'Test User',
  email: 'testuser@example.com',
  password: 'password123',
};

let testToken; // Will be set after creating the user

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
    const user = await User.create({
      ...testUser,
      role: 'staff',
    });

    // Set the department head to the created user's ID
    testDepartment.head = user._id;

    // Create test token with the user's ID
    testToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Create test department
    await Department.deleteMany({});
    await Department.create(testDepartment);
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
});

afterAll(async () => {
  await Department.deleteMany({});
  await User.deleteMany({});
  await mongoose.disconnect();
});

describe('Department Routes', () => {
  it('should get all departments', async () => {
    const res = await request(app)
      .get('/api/department')
      .set('Authorization', `Bearer ${testToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBeGreaterThan(0);
  });

  it('should get a single department by ID', async () => {
    const department = await Department.findOne();
    const res = await request(app)
      .get(`/api/department/${department._id}`)
      .set('Authorization', `Bearer ${testToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data._id).toBe(department._id.toString());
  });

  it('should return 404 for non-existent department', async () => {
    const res = await request(app)
      .get('/api/department/60d5f484f1b2c8b8f8e4c8b8') // Example non-existent ID
      .set('Authorization', `Bearer ${testToken}`);

    expect(res.statusCode).toEqual(404);
    expect(res.body.success).toBe(false);
  });
});

require('dotenv').config({ path: '.env.test' });
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');
const Class = require('../models/classModel');
const jwt = require('jsonwebtoken');

jest.setTimeout(10000);

// Mock class data
const testClass = {
  name: 'Test Class',
  level: '100',
  instructor: null,
};

// Create test token
const token = jwt.sign(
  { id: 'testUserId', email: 'test@admin.school.com', role: 'admin' },
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

    // Clear existing data and create test class
    await Class.deleteMany({});
    await Class.create(testClass);
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
});

afterAll(async () => {
  await Class.deleteMany({});
  await mongoose.disconnect();
});

describe('Class Routes', () => {
  it('should get all classes', async () => {
    const res = await request(app)
      .get('/api/class')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    // Check for proper response structure
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBeTruthy();
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('should get a class by ID', async () => {
    const classItem = await Class.findOne({ name: 'Test Class' });
    const res = await request(app)
      .get(`/api/class/${classItem._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    // Check for proper response structure
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('name', classItem.name);
  });
});

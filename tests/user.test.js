require('dotenv').config({ path: '.env.test' });
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
// const { assignRoleByEmail } = require('../utilities/roleAssigner');

jest.setTimeout(10000);
// Mock the JWT secret
const token = jwt.sign(
  { id: 'testUserId', email: 'test@admin.school.com', role: 'admin' },
  process.env.JWT_SECRET || 'testsecret',
  {
    expiresIn: '1h',
  },
);
//Mock redis client
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
    await User.create({
      name: 'Test User',
      email: 'test@admin.school.com',
      password: 'wonder123',
      role: 'admin',
    });
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
});

describe('User Routes', () => {
  it('should get all user', async () => {
    const res = await request(app)
      .get('/api/user')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
  });
});

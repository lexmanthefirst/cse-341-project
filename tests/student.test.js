require('dotenv').config({ path: '.env.test' });
const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const { Types } = mongoose; // Import Types from mongoose
const Student = require('../models/studentModel');

// Set overall Jest timeout
jest.setTimeout(10000);

describe('Student Routes', () => {
  beforeAll(async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI_TEST, {
        serverSelectionTimeoutMS: 5000,
      });
    } catch (err) {
      console.error('Database connection error:', err);
      process.exit(1);
    }
  });

  beforeEach(async () => {
    // Add timeout for setup
    await Student.deleteMany({}).maxTimeMS(5000);

    await Student.create({
      firstName: 'Chloe',
      lastName: 'Chen',
      email: 'chloe.chen@example.com',
      gender: 'female',
      dateOfBirth: '2011-01-15', // Can use either string or Date object
      classId: '507f1f77bcf86cd799439013',
      degreeId: '507f1f77bcf86cd799439011',
      address: {
        street: '789 Pine Ln',
        city: 'Austin',
        state: 'TX',
        country: 'USA',
        zip: '73301',
      },
      enrollmentDate: '2024-01-10',
      password: 'tempPassword',
      status: 'active',
    });
  });

  it('should get all student members', async () => {
    const res = await request(app).get('/api/students').timeout(5000);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Object);
  });

  it('should get a single student member by ID', async () => {
    const newStudent = await Student.create({
      firstName: 'David',
      lastName: 'Diaz',
      email: 'david.diaz@example.com',
      gender: 'male',
      dateOfBirth: '2008-11-05',
      classId: '507f1f77bcf86cd799439013',
      degreeId: '507f1f77bcf86cd799439012',
      address: {
        street: '321 Cedar Blvd',
        city: 'Miami',
        state: 'FL',
        country: 'USA',
        zip: '33101',
      },
      enrollmentDate: '2022-09-15',
      password: 'tempPassword',
      status: 'suspended',
    });

    const res = await request(app)
      .get(`/api/students/${newStudent._id}`)
      .timeout(5000);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Object);
  });

  afterAll(async () => {
    await Student.deleteMany({}).maxTimeMS(5000);
    await mongoose.disconnect();
  });
});

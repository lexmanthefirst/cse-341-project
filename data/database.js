const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI =
  process.env.NODE_ENV === 'test'
    ? process.env.MONGO_URI_TEST
    : process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed', error);
    process.exit(1);
  }
};

//Connect to Mongodb
module.exports = connectDB;

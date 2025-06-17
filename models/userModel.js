const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    role: {
      type: String,
      enum: ['student', 'staff', 'admin'],
      default: 'student',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    avatar: {
      type: String,
    },
    provider: {
      type: String,
      enum: ['local', 'google'],
      default: 'google',
    },
  },
  { timestamps: true },
);

const User = mongoose.model('User', userSchema);
module.exports = User;

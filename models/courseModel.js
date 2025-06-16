// models/courseModel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    description: String,
    teacher: {
      type: Schema.Types.ObjectId,
      ref: 'User', // User with role === 'staff'
      required: true,
    },
    creditUnits: {
      type: Number,
      default: 3,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;

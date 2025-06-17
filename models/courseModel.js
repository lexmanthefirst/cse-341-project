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
    description: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    description: String,
    instructor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
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

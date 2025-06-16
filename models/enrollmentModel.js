// models/enrollmentModel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const enrollmentSchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: 'User', // User with role === 'student'
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    grade: {
      type: String,
      enum: ['A', 'B', 'C', 'D', 'E', 'F', 'I', 'W', null],
      default: null,
    },
    status: {
      type: String,
      enum: ['enrolled', 'completed', 'withdrawn'],
      default: 'enrolled',
    },
  },
  { timestamps: true },
);

enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);

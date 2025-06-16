const Enrollment = require('../models/enrollmentModel');
const User = require('../models/userModel');
const Course = require('../models/courseModel');

// Enroll a student in a course
const enrollStudent = async (req, res) => {
  try {
    const { student, course } = req.body;

    // Validate student and course exist
    const studentUser = await User.findById(student);
    if (!studentUser || studentUser.role !== 'student') {
      return res.status(400).json({ error: 'Invalid student ID' });
    }

    const courseExists = await Course.findById(course);
    if (!courseExists) {
      return res.status(400).json({ error: 'Invalid course ID' });
    }

    // Check if enrollment already exists
    const existingEnrollment = await Enrollment.findOne({ student, course });
    if (existingEnrollment) {
      return res
        .status(400)
        .json({ error: 'Student is already enrolled in this course' });
    }

    const newEnrollment = new Enrollment({ student, course });
    await newEnrollment.save();
    res.status(201).json(newEnrollment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all enrollments
const getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('student', 'name email')
      .populate('course', 'title code');
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get enrollments for a specific student
const getStudentEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.params.studentId })
      .populate('course', 'title code teacher')
      .populate({
        path: 'course',
        populate: {
          path: 'teacher',
          select: 'name email',
        },
      });
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get enrollments for a specific course
const getCourseEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      course: req.params.courseId,
    }).populate('student', 'name email');
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update enrollment (e.g., grade or status)
const updateEnrollment = async (req, res) => {
  try {
    const { grade, status } = req.body;

    const updatedEnrollment = await Enrollment.findByIdAndUpdate(
      req.params.id,
      { grade, status },
      { new: true, runValidators: true },
    )
      .populate('student', 'name email')
      .populate('course', 'title code');

    if (!updatedEnrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }
    res.json(updatedEnrollment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Withdraw a student from a course
const withdrawStudent = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndUpdate(
      req.params.id,
      { status: 'withdrawn' },
      { new: true },
    );

    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }
    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  enrollStudent,
  getAllEnrollments,
  getStudentEnrollments,
  getCourseEnrollments,
  updateEnrollment,
  withdrawStudent,
};

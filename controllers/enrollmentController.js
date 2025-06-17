const Enrollment = require('../models/enrollmentModel');
const User = require('../models/userModel');
const Course = require('../models/courseModel');

// Enroll a student in a course
const enrollStudent = async (req, res) => {
  try {
    const { student, course } = req.body;

    // Validate student
    const studentUser = await User.findById(student);
    if (!studentUser || studentUser.role !== 'student') {
      return res.status(400).json({
        success: false,
        error: 'Invalid student ID or role',
      });
    }

    // Validate course
    const courseExists = await Course.findById(course);
    if (!courseExists) {
      return res.status(400).json({
        success: false,
        error: 'Invalid course ID',
      });
    }

    // Prevent duplicate enrollment
    const existingEnrollment = await Enrollment.findOne({ student, course });
    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        error: 'Student is already enrolled in this course',
      });
    }

    const newEnrollment = new Enrollment({ student, course });
    await newEnrollment.save();

    const populated = await newEnrollment
      .populate('student', 'name email')
      .populate('course', 'title code');

    res.status(201).json({
      success: true,
      message: 'Student enrolled successfully',
      data: populated,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get all enrollments
const getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('student', 'name email')
      .populate('course', 'title code');
    res.status(200).json({
      success: true,
      count: enrollments.length,
      message: 'All enrollments retrieved',
      data: enrollments,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all enrollments for a student
const getStudentEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      student: req.params.studentId,
    }).populate({
      path: 'course',
      select: 'title code instructor',
      populate: {
        path: 'instructor',
        select: 'name email',
      },
    });

    res.status(200).json({
      success: true,
      count: enrollments.length,
      message: 'Student enrollments retrieved',
      data: enrollments,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all enrollments for a course
const getCourseEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      course: req.params.courseId,
    }).populate('student', 'name email');

    res.status(200).json({
      success: true,
      count: enrollments.length,
      message: 'Course enrollments retrieved',
      data: enrollments,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update an enrollment (e.g., grade or status)
const updateEnrollment = async (req, res) => {
  try {
    const { grade, status } = req.body;

    const updated = await Enrollment.findByIdAndUpdate(
      req.params.id,
      { grade, status },
      { new: true, runValidators: true },
    )
      .populate('student', 'name email')
      .populate('course', 'title code');

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: 'Enrollment not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Enrollment updated successfully',
      data: updated,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Withdraw a student from a course
const withdrawStudent = async (req, res) => {
  try {
    const withdrawn = await Enrollment.findByIdAndUpdate(
      req.params.id,
      { status: 'withdrawn' },
      { new: true },
    );

    if (!withdrawn) {
      return res.status(404).json({
        success: false,
        error: 'Enrollment not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student withdrawn from course',
      data: withdrawn,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
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

const Course = require('../models/courseModel');
const User = require('../models/userModel');

// Create a new course
const createCourse = async (req, res) => {
  try {
    const { title, description, department, instructor, creditUnits } =
      req.body;

    // Validate instructor is a staff user
    if (instructor) {
      const instructorUser = await User.findById(instructor);
      if (!instructorUser || instructorUser.role !== 'staff') {
        return res
          .status(400)
          .json({ success: false, error: 'Instructor must be a staff user' });
      }
    }

    const newCourse = new Course({
      title,
      description,
      department,
      instructor,
      creditUnits,
    });
    await newCourse.save();

    const populatedCourse = await newCourse
      .populate('instructor', 'name email')
      .populate('department', 'name');

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: populatedCourse,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get all courses
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('instructor', 'name email')
      .populate('department', 'name');

    res.status(200).json({
      success: true,
      count: courses.length,
      message: 'Courses retrieved successfully',
      data: courses,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get a single course
const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email')
      .populate('department', 'name');

    if (!course) {
      return res
        .status(404)
        .json({ success: false, error: 'Course not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Course retrieved successfully',
      data: course,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update a course
const updateCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      department,
      instructor,
      creditUnits,
      isActive,
    } = req.body;

    // Validate instructor role if being updated
    if (instructor) {
      const instructorUser = await User.findById(instructor);
      if (!instructorUser || instructorUser.role !== 'staff') {
        return res
          .status(400)
          .json({ success: false, error: 'Instructor must be a staff user' });
      }
    }

    // Prepare only fields that are provided
    const updateFields = {
      ...(title && { title }),
      ...(description && { description }),
      ...(department && { department }),
      ...(instructor && { instructor }),
      ...(creditUnits !== undefined && { creditUnits }),
      ...(isActive !== undefined && { isActive }),
    };

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      updateFields,
      {
        new: true,
        runValidators: true,
      },
    )
      .populate('instructor', 'name email')
      .populate('department', 'name');

    if (!updatedCourse) {
      return res
        .status(404)
        .json({ success: false, error: 'Course not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: updatedCourse,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete a course
const deleteCourse = async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    if (!deletedCourse) {
      return res
        .status(404)
        .json({ success: false, error: 'Course not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourse,
  updateCourse,
  deleteCourse,
};

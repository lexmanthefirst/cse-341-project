const Course = require('../models/courseModel');
const User = require('../models/userModel');

// Create a new course
const createCourse = async (req, res) => {
  try {
    const { title, description, department, instructor, creditUnits } =
      req.body;

    // Validate instructor is a staff user
    const instructorUser = await User.findById(instructor);
    if (!instructorUser || instructorUser.role !== 'staff') {
      return res.status(400).json({ error: 'Instructor must be a staff user' });
    }

    const newCourse = new Course({
      title,
      description,
      department,
      instructor,
      creditUnits,
    });

    await newCourse.save();

    const populatedCourse = await newCourse.populate(
      'instructor',
      'name email',
    );

    res.status(201).json(populatedCourse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all courses
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('instructor', 'name email')
      .populate('department', 'name');
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single course
const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email')
      .populate('department', 'name');

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
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

    if (instructor) {
      const instructorUser = await User.findById(instructor);
      if (!instructorUser || instructorUser.role !== 'staff') {
        return res
          .status(400)
          .json({ error: 'Instructor must be a staff user' });
      }
    }

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
      { new: true, runValidators: true },
    )
      .populate('instructor', 'name email')
      .populate('department', 'name');

    if (!updatedCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.status(200).json(updatedCourse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a course
const deleteCourse = async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    if (!deletedCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourse,
  updateCourse,
  deleteCourse,
};

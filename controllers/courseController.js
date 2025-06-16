const Course = require('../models/courseModel');
const User = require('../models/userModel');

// Create a new course
const createCourse = async (req, res) => {
  try {
    const { title, code, description, teacher, creditUnits } = req.body;

    // Validate teacher is a staff user
    const teacherUser = await User.findById(teacher);
    if (!teacherUser || teacherUser.role !== 'staff') {
      return res.status(400).json({ error: 'Teacher must be a staff user' });
    }

    const newCourse = new Course({
      title,
      code,
      description,
      teacher,
      creditUnits,
    });
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all courses
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('teacher', 'name email');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single course
const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      'teacher',
      'name email',
    );
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a course
const updateCourse = async (req, res) => {
  try {
    const { title, code, description, teacher, creditUnits, isActive } =
      req.body;

    if (teacher) {
      const teacherUser = await User.findById(teacher);
      if (!teacherUser || teacherUser.role !== 'staff') {
        return res.status(400).json({ error: 'Teacher must be a staff user' });
      }
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { title, code, description, teacher, creditUnits, isActive },
      { new: true, runValidators: true },
    ).populate('teacher', 'name email');

    if (!updatedCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(updatedCourse);
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
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createCourse,
  deleteCourse,
  updateCourse,
  getCourse,
  getAllCourses,
};

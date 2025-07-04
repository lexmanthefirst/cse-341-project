const ClassGroup = require('../models/classModel');
const User = require('../models/userModel');

// Create a new class group
const createClassGroup = async (req, res) => {
  try {
    const { name, level, instructor } = req.body;

    // Validate instructor if provided
    if (instructor) {
      const instructorUser = await User.findById(instructor);
      if (!instructorUser || instructorUser.role !== 'staff') {
        return res.status(400).json({
          success: false,
          error: 'Class instructor must be a staff user',
        });
      }
    }

    const newClass = new ClassGroup({ name, level, instructor });
    await newClass.save();

    res.status(201).json({
      success: true,
      message: 'Class group created successfully',
      data: newClass,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get all class groups
const getAllClassGroups = async (req, res) => {
  try {
    const classes = await ClassGroup.find().populate(
      'instructor',
      'name email',
    );
    res.status(200).json({
      success: true,
      message: 'Class groups retrieved successfully',
      count: classes.length,
      data: classes,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get a single class group
const getClassGroup = async (req, res) => {
  try {
    const classGroup = await ClassGroup.findById(req.params.id).populate(
      'instructor',
      'name email',
    );
    if (!classGroup) {
      return res
        .status(404)
        .json({ success: false, error: 'Class group not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Class group retrieved successfully',
      data: classGroup,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update a class group
const updateClassGroup = async (req, res) => {
  try {
    const { name, level, instructor } = req.body;

    if (instructor) {
      const instructorUser = await User.findById(instructor);
      if (!instructorUser || instructorUser.role !== 'staff') {
        return res.status(400).json({
          success: false,
          error: 'Class instructor must be a staff user',
        });
      }
    }

    const updatedClass = await ClassGroup.findByIdAndUpdate(
      req.params.id,
      { name, level, instructor },
      { new: true, runValidators: true },
    ).populate('instructor', 'name email');

    if (!updatedClass) {
      return res
        .status(404)
        .json({ success: false, error: 'Class group not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Class group updated successfully',
      data: updatedClass,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete a class group
const deleteClassGroup = async (req, res) => {
  try {
    const deletedClass = await ClassGroup.findByIdAndDelete(req.params.id);
    if (!deletedClass) {
      return res
        .status(404)
        .json({ success: false, error: 'Class group not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Class group deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  createClassGroup,
  deleteClassGroup,
  updateClassGroup,
  getAllClassGroups,
  getClassGroup,
};

const ClassGroup = require('../models/classModel');
const User = require('../models/userModel');

// Create a new class group
const createClassGroup = async (req, res) => {
  try {
    const { name, level, classTeacher } = req.body;

    // Validate class teacher is a staff user
    if (classTeacher) {
      const teacher = await User.findById(classTeacher);
      if (!teacher || teacher.role !== 'staff') {
        return res
          .status(400)
          .json({ error: 'Class teacher must be a staff user' });
      }
    }

    const newClass = new ClassGroup({ name, level, classTeacher });
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
      'classTeacher',
      'name email',
    );
    res.json(classes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single class group
const getClassGroup = async (req, res) => {
  try {
    const classGroup = await ClassGroup.findById(req.params.id).populate(
      'classTeacher',
      'name email',
    );
    if (!classGroup) {
      return res.status(404).json({ error: 'Class group not found' });
    }
    res.json(classGroup);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a class group
const updateClassGroup = async (req, res) => {
  try {
    const { name, level, classTeacher } = req.body;

    if (classTeacher) {
      const teacher = await User.findById(classTeacher);
      if (!teacher || teacher.role !== 'staff') {
        return res
          .status(400)
          .json({ error: 'Class teacher must be a staff user' });
      }
    }

    const updatedClass = await ClassGroup.findByIdAndUpdate(
      req.params.id,
      { name, level, classTeacher },
      { new: true, runValidators: true },
    ).populate('classTeacher', 'name email');

    if (!updatedClass) {
      return res.status(404).json({ error: 'Class group not found' });
    }
    res.json(updatedClass);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a class group
const deleteClassGroup = async (req, res) => {
  try {
    const deletedClass = await ClassGroup.findByIdAndDelete(req.params.id);
    if (!deletedClass) {
      return res.status(404).json({ error: 'Class group not found' });
    }
    res.json({ message: 'Class group deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createClassGroup,
  deleteClassGroup,
  updateClassGroup,
  getAllClassGroups,
  getClassGroup,
};

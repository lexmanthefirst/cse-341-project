const Department = require('../models/departmentModel');
const User = require('../models/userModel');

// Create a new department
const createDepartment = async (req, res) => {
  try {
    const { name, description, head } = req.body;

    // Validate head is a staff user
    if (head) {
      const headUser = await User.findById(head);
      if (!headUser || headUser.role !== 'staff') {
        return res.status(400).json({
          success: false,
          error: 'Department head must be a staff user',
        });
      }
    }

    const newDepartment = new Department({ name, description, head });
    await newDepartment.save();

    const populated = await newDepartment.populate('head', 'name email');

    res.status(201).json({
      success: true,
      message: 'Department created successfully',
      data: populated,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get all departments
const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find().populate('head', 'name email');
    res.status(200).json({
      success: true,
      count: departments.length,
      message: 'Departments retrieved successfully',
      data: departments,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get a single department
const getDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id).populate(
      'head',
      'name email',
    );

    if (!department) {
      return res
        .status(404)
        .json({ success: false, error: 'Department not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Department retrieved successfully',
      data: department,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update a department
const updateDepartment = async (req, res) => {
  try {
    const { name, description, head } = req.body;

    // Validate new head if provided
    if (head) {
      const headUser = await User.findById(head);
      if (!headUser || headUser.role !== 'staff') {
        return res.status(400).json({
          success: false,
          error: 'Department head must be a staff user',
        });
      }
    }

    const updateFields = {
      ...(name && { name }),
      ...(description && { description }),
      ...(head && { head }),
    };

    const updatedDepartment = await Department.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true },
    ).populate('head', 'name email');

    if (!updatedDepartment) {
      return res
        .status(404)
        .json({ success: false, error: 'Department not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Department updated successfully',
      data: updatedDepartment,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete a department
const deleteDepartment = async (req, res) => {
  try {
    const deleted = await Department.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, error: 'Department not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Department deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  createDepartment,
  getAllDepartments,
  getDepartment,
  updateDepartment,
  deleteDepartment,
};

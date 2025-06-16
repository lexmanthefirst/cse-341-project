const Department = require('../models/departmentModel');
const User = require('../models/userModel');

// Create a new department
const createDepartment = async (req, res) => {
  try {
    const { name, code, head } = req.body;

    if (head) {
      const headUser = await User.findById(head);
      if (!headUser || headUser.role !== 'staff') {
        return res
          .status(400)
          .json({ error: 'Department head must be a staff user' });
      }
    }

    const newDepartment = new Department({ name, code, head });
    await newDepartment.save();
    res.status(201).json(newDepartment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all departments
const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find().populate('head', 'name email');
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
      return res.status(404).json({ error: 'Department not found' });
    }
    res.json(department);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a department
const updateDepartment = async (req, res) => {
  try {
    const { name, code, head } = req.body;

    if (head) {
      const headUser = await User.findById(head);
      if (!headUser || headUser.role !== 'staff') {
        return res
          .status(400)
          .json({ error: 'Department head must be a staff user' });
      }
    }

    const updatedDepartment = await Department.findByIdAndUpdate(
      req.params.id,
      { name, code, head },
      { new: true, runValidators: true },
    ).populate('head', 'name email');

    if (!updatedDepartment) {
      return res.status(404).json({ error: 'Department not found' });
    }
    res.json(updatedDepartment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a department
const deleteDepartment = async (req, res) => {
  try {
    const deletedDepartment = await Department.findByIdAndDelete(req.params.id);
    if (!deletedDepartment) {
      return res.status(404).json({ error: 'Department not found' });
    }
    res.json({ message: 'Department deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  deleteDepartment,
  updateDepartment,
  getDepartment,
  getAllDepartments,
  createDepartment,
};

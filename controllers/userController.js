const User = require('../models/userModel');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { assignRoleByEmail } = require('../utilities/roleAssigner');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: err.message,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    console.error(`Error fetching user ${req.params.id}:`, err);
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: err.message,
    });
  }
};

const getUserByEmail = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    console.error(`Error fetching user with email ${req.params.email}:`, err);
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: err.message,
    });
  }
};

const createUser = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array(),
      });
    }

    const { name, password } = req.body;

    // Assign role based on domain
    const email = req.body.email.toLowerCase();
    const role = assignRoleByEmail(email);

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      name,
      email,
      password: hashedPassword,
      role,
    };

    const saved = await User.create(newUser);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: saved,
    });
  } catch (err) {
    console.error('Error creating user:', err);
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: err.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array(),
      });
    }

    const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: updated,
    });
  } catch (err) {
    console.error(`Error updating user ${req.params.id}:`, err);
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: err.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (err) {
    console.error(`Error deleting user ${req.params.id}:`, err);
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: err.message,
    });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  updateUser,
  createUser,
  getUserByEmail,
  getUserById,
};

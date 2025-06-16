const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid credentials' });

    // Generate JWT
    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
const signup = async (req, res) => {
  const { email, password, name, role } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({
      email,
      password: hashedPassword,
      name,
      role: role || 'student',
    });

    const savedUser = await user.save();

    // Create token
    const payload = { id: savedUser._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({
      message: 'User created',
      token,
      user: {
        id: savedUser._id,
        email: savedUser.email,
        name: savedUser.name,
        role: savedUser.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  login,
  signup,
};

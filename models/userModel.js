const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    role: {
      type: String,
      enum: ['student', 'staff', 'admin'],
      default: 'student',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    avatar: {
      type: String,
    },
    provider: {
      type: String,
      enum: ['local', 'google'],
      default: 'google',
    },
  },
  { timestamps: true },
);

// Hash password before saving
// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();

//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

// // Method to compare password
// userSchema.methods.comparePassword = async function (candidatePassword) {
//   return bcrypt.compare(candidatePassword, this.password);
// };

const User = mongoose.model('User', userSchema);
module.exports = User;

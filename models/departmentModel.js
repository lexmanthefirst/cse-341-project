// models/departmentModel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const departmentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    head: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
  },
  { timestamps: true },
);

const Department = mongoose.model('Department', departmentSchema);
module.exports = Department;

// models/classGroupModel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const classGroupSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    level: {
      type: String,
      enum: ['JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3'],
      required: true,
    },
    classTeacher: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
  },
  { timestamps: true },
);

const ClassGroup = mongoose.model('ClassGroup', classGroupSchema);

module.exports = ClassGroup;

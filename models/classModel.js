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
      enum: [
        '100',
        '200',
        '300',
        '400',
        '500',
        'SS1',
        'SS2',
        'SS3',
        'JSS1',
        'JS2',
        'JS3',
      ],
      required: true,
    },
    instructor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
  },
  { timestamps: true },
);

const ClassGroup = mongoose.model('ClassGroup', classGroupSchema);

module.exports = ClassGroup;

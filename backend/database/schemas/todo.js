import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    max_length: 255,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false
});

todoSchema.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});

// Define a pre-updateOne hook to update updated_at field
todoSchema.pre('updateOne', function (next) {
  this.update({}, { $set: { updated_at: Date.now() } });
  next();
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;

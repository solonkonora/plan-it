import express from "express";
import Todo from "../database/schemas/todo.js";
import mongoose from 'mongoose';

const router = express.Router();

// Get all todos
router.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.status(200).json(todos);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// Create a new todo
router.post('/todos', async (req, res) => {
  try {
    const { title, description } = req.body;
    const newTodo = new Todo({ title, description, done: false });
    const savedTodo = await newTodo.save(); // Save the new todo to the database
    res.status(201).json(savedTodo);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

router.put('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const updateData = {
    title: req.body.title,
    description: req.body.description,
    isCompleted: req.body.isCompleted,
  };

  Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

  if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid Todo ID format' });
  }

  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      updateData,
      {
          new: true,
          runValidators: true
      }
    );

    if (!updatedTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.status(200).json(updatedTodo);

  } catch (err) {
    console.error("Error updating todo:", err); 
    if (err.name === 'ValidationError') {
         return res.status(400).json({ error: 'Validation failed', details: err.errors });
    }

    res.status(500).json({ error: 'Failed to update todo due to server error' });
  }
});

  // Delete a todo by ID
  router.delete('/todos/:id', async (req, res) => {
    try {
      const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
      if (!deletedTodo) return res.status(404).json({ error: 'Todo not found' });
      res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete todo' });
    }
  }); 

export default router;

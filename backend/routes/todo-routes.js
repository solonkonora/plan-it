// import express from "express";
// import Todo from "../database/schemas/todo";

// const router = express.Router();

// // Get all todos
// router.get('/todos', async (req, res) => {
//   try {
//     const todos = await Todo.find();
//     res.status(200).json(todos);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch todos' });
//   }
// });

// // Get a single todo by ID
// router.get('/todos/:id', async (req, res) => {
//   try {
//     const todo = await Todo.findById(req.params.id);
//     if (!todo) return res.status(404).json({ error: 'Todo not found' });
//     res.status(200).json(todo);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch todo' });
//   }
// });

// // Create a new todo
// router.post('/todos', async (req, res) => {
//   try {
//     const { title, description } = req.body;
//     const newTodo = new Todo({ title, description, done: false });
//     const savedTodo = await newTodo.save();
//     res.status(201).json(savedTodo);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to create todo' });
//   }
// });

// // Update a todo by ID
// router.put('/todos/:id', async (req, res) => {
//   try {
//     const updatedTodo = await Todo.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     if (!updatedTodo) return res.status(404).json({ error: 'Todo not found' });
//     res.status(200).json(updatedTodo);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to update todo' });
//   }
// });

// // Delete a todo by ID
// router.delete('/todos/:id', async (req, res) => {
//   try {
//     const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
//     if (!deletedTodo) return res.status(404).json({ error: 'Todo not found' });
//     res.status(200).json({ message: 'Todo deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to delete todo' });
//   }
// });

// export default router;




import express from "express";
import Todo from "../database/schemas/todo.js";

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

// Update a todo by ID
router.put('/todos/:id', async (req, res) => {
    try {
      const updatedTodo = await Todo.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedTodo) return res.status(404).json({ error: 'Todo not found' });
      res.status(200).json(updatedTodo);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update todo' });
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

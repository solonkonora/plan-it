// import express from "express";
// import "./database/connection/mongo.js"; 
// import todoRoutes from "./routes/todo-routes.js";

// // Create an instance of an Express app
// const app = express();

// const PORT = 3000;

// // Middleware to parse JSON requests
// app.use(express.json());

// // Mount the todo routes under /api
// app.use('/api', todoRoutes);

// // Define a route for the root URL
// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running at http://localhost:${PORT}`);
// });


import express from "express";
import cors from 'cors'; // 1. Import the cors middleware
import "./database/connection/mongo.js";
import todoRoutes from "./routes/todo-routes.js";

// Create an instance of an Express app
const app = express();

const PORT = 3000;

// Middleware to parse JSON requests
app.use(express.json());

app.use(cors());

// Mount the todo routes under /api
app.use('/api', todoRoutes);

// Define a route for the root URL
app.get('/', (req, res) => {
  res.send('Hello World! CORS should be enabled.');
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  console.log('CORS enabled for all origins.');
});
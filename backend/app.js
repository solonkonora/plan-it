import express from "express";
import "./database/connection/mongo.js"

// Create an instance of an Express app
const app = express();

const PORT = 3000;

// Define a route for the root URL
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

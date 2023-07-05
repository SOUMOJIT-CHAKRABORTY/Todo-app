const express = require("express");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const cors = require("cors");

const app = express();
const port = 3000;
const dataFilePath = `${__dirname}/todos.json`;

// Middleware to parse JSON bodies
app.use(express.json());
// Middleware CORS
app.use(cors());

// Read existing todos from file
let todos = [];
fs.readFile(dataFilePath, "utf-8", (err, data) => {
  if (!err) {
    todos = JSON.parse(data);
  }
});

// Create a new todo item
app.post("/todos", (req, res) => {
  const { title, description } = req.body;
  const newTodo = {
    id: uuidv4(),
    title,
    description,
  };
  todos.push(newTodo);
  saveDataToFile();
  res.status(201).json(newTodo);
});

// Retrieve all todo items
app.get("/todos", (req, res) => {
  res.status(200).json(todos);
});

// Retrieve a specific todo item by ID
app.get("/todos/:id", (req, res) => {
  const { id } = req.params;
  const todo = todos.find((todo) => todo.id === id);
  if (todo) {
    res.status(200).json(todo);
  } else {
    res.status(404).json({
      error: "Todo not found",
    });
  }
});

// Update a specific todo item
app.put("/todos/:id", (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const todo = todos.find((todo) => todo.id === id);
  if (todo) {
    todo.title = title || todo.title;
    todo.description = description || todo.description;
    saveDataToFile();
    res.status(200).json(todo);
  } else {
    res.status(404).json({
      error: "Todo not found",
    });
  }
});

// Delete a specific todo item
app.delete("/todos/:id", (req, res) => {
  const { id } = req.params;
  const index = todos.findIndex((todo) => todo.id === id);
  if (index !== -1) {
    todos.splice(index, 1);
    saveDataToFile();
    res.status(200).json({
      message: "Todo deleted successfully",
    });
  } else {
    res.status(404).json({
      error: "Todo not found",
    });
  }
});

// Catch-all route for undefined routes
app.all("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

// Save todos data to file
function saveDataToFile() {
  fs.writeFile(dataFilePath, JSON.stringify(todos), (err) => {
    if (err) {
      console.error("Error saving data to file:", err);
    }
  });
}

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = app;

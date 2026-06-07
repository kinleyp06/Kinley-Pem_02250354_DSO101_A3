const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static("public"));

// Sample todos array
let todos = [
  { id: 1, title: "Learn Node.js", completed: false },
  { id: 2, title: "Build Todo App", completed: false },
];

// Routes
app.get("/api/todos", (req, res) => {
  res.json(todos);
});

app.post("/api/todos", (req, res) => {
  const newTodo = {
    id: todos.length + 1,
    title: req.body.title,
    completed: false,
  };
  todos.push(newTodo);
  res.json(newTodo);
});

app.delete("/api/todos/:id", (req, res) => {
  todos = todos.filter((todo) => todo.id !== parseInt(req.params.id));
  res.json({ message: "Todo deleted" });
});

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Todo App is running!" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

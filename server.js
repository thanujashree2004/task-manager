require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// ROUTES
app.use("/", authRoutes);
app.use("/tasks", taskRoutes);

// HEALTH CHECK
app.get("/", (req, res) => {
  res.send("Task Manager API Running ✔");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
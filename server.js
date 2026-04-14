const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Connect MongoDB
mongoose.connect("mongodb://localhost:27017/crm")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("DB Error:", err));

const Task = mongoose.model("Task", {
  title: String,
  description: String,
  assignedTo: String,
  assignedBy: String,

  status: {
    type: String,
    default: "To Do"
  },

  remarks: {
    type: String,
    default: ""
  }
});

// CREATE TASK
app.post("/tasks", async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  res.send(task);
});

// GET TASKS
app.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.send(tasks);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log("Server running on " + PORT));

app.put("/tasks/:id/complete", async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    {
      status: "Completed",
      remarks: req.body.remarks
    },
    { new: true }
  );

  res.send(task);
});
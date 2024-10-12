const Task = require("../models/Task");

const getTasks = async (req, res) => {
  const tasks = await Task.find({ user: req.user._id });
  res.json(tasks);
};

const createTask = async (req, res) => {
  const { title, description } = req.body;

  const task = new Task({
    user: req.user._id,
    title,
    description,
    status: "To Do",
  });

  const createdTask = await task.save();
  res.status(201).json(createdTask);
};

const updateTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (task.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "Not authorized" });
  }

  if (task) {
    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.status = req.body.status || task.status;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } else {
    res.status(404).json({ message: "Task not found" });
  }
};

const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (task.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "Not authorized" });
  }

  if (task) {
    await task.deleteOne(); // Use deleteOne instead of remove
    res.json({ message: "Task removed" });
  } else {
    res.status(404).json({ message: "Task not found" });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };

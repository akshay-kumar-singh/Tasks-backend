const router = require("express").Router();
const Task = require("../models/Task");

router.post("/api/tasks", async (req, res) => {
  try {
    const { task, date } = req.body;

    if (!task || !date) {
      return res.status(400).json({ message: "Task and date are required" });
    }

    const newTask = new Task({
      task,
      date,
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/api/tasks", async (req, res) => {
  try {
    let filter = {};

    if (req.query.month) {
      const month = parseInt(req.query.month);
      filter = {
        $expr: {
          $eq: [{ $month: "$date" }, month + 1],
        },
      };
    }

    const tasks = await Task.find(filter).sort({ date: 1 });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/api/tasks/:id", async (req, res) => {
  try {
    const { task, date } = req.body;

    if (!task || !date) {
      return res.status(400).json({ message: "Task and date are required" });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { task, date },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/api/tasks/:id", async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

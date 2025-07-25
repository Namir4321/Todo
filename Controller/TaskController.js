// const taskSchema from "../"
const Task = require("../Model/Task");
const { taskSchema, validationWithZodSchema } = require("../utils/validator");
exports.addTask = async (req, res, next) => {
  try {
    console.log(req.body)
    const ValidatedFields = await validationWithZodSchema(req.body, taskSchema);
    // console.log(ValidatedFields);
    const newTask = await Task.create({
      ...ValidatedFields,
      user: req.user.id,
    });
    res.status(201).json(newTask);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
exports.getAllTasks = async (req, res, next) => {
  try {
    const { search, project, tags, members } = req.query;
    console.log(req.user);
    let filter = {
      user: req.user.id,
    };
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (project) {
      filter.project = project;
    }
    if (tags) {
      const tagsArray = tags.split(",").map((tag) => tag.trim());
      filter.tags = { $in: tagsArray };
    }
    if (members) {
      const membersArray = members.split(",").map((member) => member.trim());
      filter.members = { $in: membersArray };
    }
    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.updateTask = async (req, res, next) => {
  const { id } = req.params;
  console.log(req.body)
  try {
    const validatedData = await validationWithZodSchema(req.body, taskSchema);
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    if (task.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Unauthorized to update this task" });
    }
    const updatedTask = await Task.findByIdAndUpdate(id, validatedData, {
      new: true,
    });
    res.status(200).json(updatedTask);
  } catch (err) {
    console.error("Task update error:", err);
    res.status(400).json({ error: err.message || "Failed to update task" });
  }
};
exports.deleteTask = async (req, res, next) => {
  const { id } = req.params;
  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    if (task.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this task" });
    }

    await Task.findByIdAndDelete(id);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Task delete error:", err);
    res.status(500).json({ error: "Failed to delete task" });
  }
};
exports.getSingleTask = async (req, res, next) => {
  const { id } = req.params;
  try {
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized to view this task" });
    }
    res.status(200).json(task);
  } catch (err) {
    console.error("Get single task error:", err);
    res.status(500).json({ error: "Failed to fetch task" });
  }
};

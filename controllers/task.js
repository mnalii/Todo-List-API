const Task = require("../models/task");

exports.addTask = async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id
  });

  try {
    await task.save();
    res.status(201).json({
      success: true,
      data: task
    });
  } catch (err) {
    res.status(400).json(err.message);
  }
};

exports.getTaskById = async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findOne({ _id, owner: req.user._id });

    if (!task) {
      return res.status(404).json({
        succes: false,
        message: "No task found"
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.getTask = async (req, res) => {
  const match = {};
  const sort = {};

  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }

  try {
    await req.user
      .populate({
        path: "tasks",
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort
        }
      })
      .execPopulate();
    res.json({
      count: req.user.tasks.length,
      data: req.user.tasks
    });
    // console.log(req.user.tasks.length);
  } catch (err) {
    res.status(500).json(err.mesage);
  }
};

exports.updateTask = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).json({ error: "Invalid updates!" });
  }

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "No task found"
      });
    }

    updates.forEach(update => (task[update] = req.body[update]));
    await task.save();
    res.json({
      success: true,
      data: task
    });
  } catch (err) {
    res.status(400).json(err.message);
  }
};

exports.deleteTaskById = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!task) {
      res.status(404).json({
        success: false,
        message: "No task found"
      });
    }

    res.json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(500).json(err.mesage);
  }
};

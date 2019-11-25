const express = require("express");
const auth = require("../middleware/auth");
const router = new express.Router();
const {
  addTask,
  getTaskById,
  getTask,
  updateTask,
  deleteTaskById
} = require("../controllers/task");

router.post("/", auth, addTask);

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=20
// GET /tasks?sortBy=createdAt:desc
router.get("/", auth, getTask);

router.get("/:id", auth, getTaskById);

router.put("/:id", auth, updateTask);

router.delete("/:id", auth, deleteTaskById);

module.exports = router;

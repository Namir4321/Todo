const express = require("express");
const router = express.Router();
const { userAuth } = require("../Middleware/auth");
const taskController = require("../Controller/TaskController");
router.post("/add", userAuth, taskController.addTask);
router.put("/update/:id", userAuth, taskController.updateTask);
router.delete("/delete/:id", userAuth, taskController.deleteTask);
router.get("/getall", userAuth, taskController.getAllTasks);
router.get("/getsingle/:id",userAuth,taskController.getSingleTask)
module.exports = router;

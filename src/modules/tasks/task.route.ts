import { Router } from "express";
import Container from "typedi";
import { TaskController } from "./task.controller";

const taskRoutes = Router();
const taskController = Container.get(TaskController);

taskRoutes.post("/", taskController.createTask);
taskRoutes.get("/", taskController.getAllTasks);
taskRoutes.get("/:id", taskController.getTask);
taskRoutes.put("/:id", taskController.updateTask);
taskRoutes.delete("/:id", taskController.deleteTask);

export default taskRoutes;

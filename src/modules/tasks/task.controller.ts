import { Service } from "typedi";
import { Request, Response, NextFunction } from "express";
import { TaskService } from "./task.service";
import { asyncHandler } from "../../middlewares/async-handler.middleware";
import { IRequestUser } from "../../common/interfaces";
import {
  createTaskSchema,
  deleteTaskSchema,
  getAllTasksSchema,
  getTaskSchema,
  updateTaskSchema,
} from "./task.validation";
import { HttpStatus } from "../../configs/http.config";
import { DEFAULT_LIMIT } from "../../common/constants";

@Service()
export class TaskController {
  constructor(private taskService: TaskService) {}

  createTask = asyncHandler(
    async (req: IRequestUser, res: Response, next: NextFunction) => {
      const body = createTaskSchema.parse({
        ...req.body,
        createdBy: req.user.id,
      });

      const task = await this.taskService.createTask(body);

      res.status(HttpStatus.CREATED).json({
        message: "Task created successfully",
        data: task,
      });
    }
  );

  getAllTasks = asyncHandler(
    async (req: IRequestUser, res: Response, next: NextFunction) => {
      const query = getAllTasksSchema.parse({
        ...req.query,
        limit: Number(req.query?.limit) ?? DEFAULT_LIMIT,
        skip: Number(req.query?.skip) ?? 0,
        createdBy: req.user.id,
      });

      const tasks = await this.taskService.getAllTasks(query);

      res.status(HttpStatus.OK).json({
        message: "Tasks fetched successfully",
        data: tasks,
      });
    }
  );

  getTask = asyncHandler(
    async (req: IRequestUser, res: Response, next: NextFunction) => {
      const param = getTaskSchema.parse({
        id: req.params.id,
      });

      const task = await this.taskService.getTask(param.id);

      res.status(HttpStatus.OK).json({
        message: "Task fetched successfully",
        data: task,
      });
    }
  );

  updateTask = asyncHandler(
    async (req: IRequestUser, res: Response, next: NextFunction) => {
      const body = updateTaskSchema.parse({
        ...req.body,
        id: req.params.id,
        createdBy: req.user.id,
      });

      await this.taskService.updateTask(body);

      res.status(HttpStatus.OK).json({
        message: "Task updated successfully",
      });
    }
  );

  deleteTask = asyncHandler(
    async (req: IRequestUser, res: Response, next: NextFunction) => {
      const payload = deleteTaskSchema.parse({
        id: req.params.id,
        createdBy: req.user.id,
      });

      await this.taskService.deleteTask(payload);

      res.status(HttpStatus.OK).json({
        message: "Task deleted successfully",
      });
    }
  );
}

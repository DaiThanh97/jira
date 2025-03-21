import { Service } from "typedi";
import { TaskRepository } from "./task.repository";
import {
  CreateTaskPayload,
  DeleteTaskPayload,
  GetAllTasksPayload,
  UpdateTaskPayload,
} from "./task.validation";
import { ProjectService } from "../projects/project.service";
import { BadRequestException, NotFoundException } from "../../utils/error";
import { UserService } from "../users/user.service";

@Service()
export class TaskService {
  constructor(
    private taskRepository: TaskRepository,
    private projectService: ProjectService,
    private userService: UserService
  ) {}

  async createTask(payload: CreateTaskPayload) {
    const project = await this.projectService.getProject(payload.projectId);

    if (!project) {
      throw new BadRequestException("Project not exists");
    }

    const createdBy = await this.userService.getUserById(payload.createdBy);

    if (!createdBy) {
      throw new BadRequestException("User creates this task is invalid");
    }

    let assignee;
    if (payload.assignedTo) {
      assignee = await this.userService.getUserById(payload.assignedTo);

      if (!assignee) {
        throw new BadRequestException("Assignee is invalid");
      }
    }

    return this.taskRepository.createTask(
      payload,
      project,
      createdBy,
      assignee
    );
  }

  async getAllTasks(payload: GetAllTasksPayload) {
    return this.taskRepository.findTasks(payload);
  }

  async getTask(id: string) {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new NotFoundException("Task not found");
    }

    return this.taskRepository.findById(id);
  }

  async updateTask(payload: UpdateTaskPayload) {
    const task = await this.getTask(payload.id);
    if (task?.createdBy.id !== payload.createdBy) {
      throw new BadRequestException("User cannot update this task");
    }

    let assignee;
    if (payload.assignedTo) {
      assignee = await this.userService.getUserById(payload.assignedTo);

      if (!assignee) {
        throw new BadRequestException("Assignee is invalid");
      }
    }

    return this.taskRepository.updateTask(payload, assignee);
  }

  async deleteTask({ id, createdBy }: DeleteTaskPayload) {
    const task = await this.getTask(id);
    if (task?.createdBy.id !== createdBy) {
      throw new BadRequestException("User cannot delete this task");
    }

    return this.taskRepository.deleteTask(id);
  }
}

import { Repository } from "typeorm";
import { Service } from "typedi";
import { AppDataSource } from "../../configs/database.config";
import { TaskEntity } from "./task.entity";
import {
  CreateTaskPayload,
  GetAllTasksPayload,
  UpdateTaskPayload,
} from "./task.validation";
import { TaskPriority, TaskStatus } from "./task.enum";
import { ProjectEntity } from "../projects/project.entity";
import { UserEntity } from "../users/user.entity";
import { IListResponse } from "../../common/interfaces";

@Service()
export class TaskRepository extends Repository<TaskEntity> {
  constructor() {
    super(TaskEntity, AppDataSource.manager);
  }

  async findById(id: string): Promise<TaskEntity | null> {
    return this.findOne({
      where: {
        id,
      },
      select: {
        createdBy: {
          id: true,
        },
      },
    });
  }

  async createTask(
    task: CreateTaskPayload,
    project: ProjectEntity,
    createdBy: UserEntity,
    assignee?: UserEntity
  ) {
    const newTask = new TaskEntity();
    newTask.title = task.title;
    newTask.description = task.description;
    newTask.status = task.status ?? TaskStatus.TODO;
    newTask.priority = task.priority ?? TaskPriority.LOW;
    newTask.due_date = task.dueDate ? new Date(task.dueDate) : undefined;
    newTask.project = project;
    newTask.createdBy = createdBy;

    if (assignee) {
      newTask.assignee = assignee;
    }

    return this.save(newTask);
  }

  async findTasks({
    title,
    assignedTo,
    priority,
    status,
    createdBy,
    skip,
    limit,
  }: GetAllTasksPayload): Promise<IListResponse<TaskEntity>> {
    const [tasks, total] = await this.findAndCount({
      where: {
        ...(title && { title }),
        ...(priority && { priority }),
        ...(status && { status }),
        ...(assignedTo && { assignee: { id: assignedTo } }),
        ...(createdBy && { createdBy: { id: createdBy } }),
      },
      take: limit,
      skip,
    });

    return {
      total,
      data: tasks,
    };
  }

  async updateTask(payload: UpdateTaskPayload, assignee?: UserEntity) {
    const { id, title, description, status, priority, dueDate } = payload;
    return this.update(id, {
      title,
      description,
      status,
      priority,
      due_date: dueDate ? new Date(dueDate) : undefined,
      assignee,
    });
  }

  async deleteTask(id: string) {
    return this.delete(id);
  }
}

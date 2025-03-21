import { UserService } from "../users/user.service";
import { TaskService } from "../tasks/task.service";
import { TaskEntity } from "../tasks/task.entity";
import { UserEntity } from "../users/user.entity";
import { BadRequestException, NotFoundException } from "../../utils/error";
import { TaskRepository } from "./task.repository";
import { ProjectService } from "../projects/project.service";
import { TaskPriority, TaskStatus } from "./task.enum";

jest.mock("./../../utils/environment", () => ({
  Enviroment: {},
}));
jest.mock("./task.repository");
jest.mock("../projects/project.service");
jest.mock("../users/user.service");

describe("TaskService", () => {
  let taskService: TaskService;
  let taskRepository: jest.Mocked<TaskRepository>;
  let userService: jest.Mocked<UserService>;
  let projectService: jest.Mocked<ProjectService>;

  beforeEach(() => {
    jest.clearAllMocks();

    taskRepository = {
      findById: jest.fn(),
      createTask: jest.fn(),
      findTasks: jest.fn(),
      updateTask: jest.fn(),
      deleteTask: jest.fn(),
    } as unknown as jest.Mocked<TaskRepository>;

    projectService = {
      getProject: jest.fn(),
    } as unknown as jest.Mocked<ProjectService>;

    userService = {
      getUserById: jest.fn(),
    } as unknown as jest.Mocked<UserService>;

    taskService = new TaskService(taskRepository, projectService, userService);
  });

  describe("createTask", () => {
    const mockPayload = {
      title: "Test task",
      description: "Test description",
      projectId: "project-id",
      createdBy: "user-id",
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      assignedTo: "assignee-id",
    };

    const mockProject = { id: "project-id" };
    const mockCreatedBy = { id: "user-id" };
    const mockAssignee = { id: "assignee-id" };
    const mockCreatedTask = {
      id: "task-id",
      title: "Test task",
      description: "Test description",
      projectId: mockProject,
      createdBy: mockCreatedBy,
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      assignee: mockAssignee,
    };

    it("Should create a task", async () => {
      // Prepare
      projectService.getProject = jest.fn().mockResolvedValue(mockProject);
      userService.getUserById = jest
        .fn()
        .mockResolvedValueOnce(mockCreatedBy)
        .mockResolvedValueOnce(mockAssignee);
      taskRepository.createTask = jest.fn().mockResolvedValue(mockCreatedTask);

      const result = await taskService.createTask(mockPayload);

      // Assert
      expect(projectService.getProject).toHaveBeenCalledWith(
        mockPayload.projectId
      );
      expect(result).toEqual(mockCreatedTask);
    });

    it("Should throw Bad Request if project does not exist", async () => {
      // Prepare
      projectService.getProject = jest.fn().mockResolvedValue(null);

      await expect(taskService.createTask(mockPayload)).rejects.toThrow(
        new BadRequestException("Project not exists")
      );

      // Assert
      expect(projectService.getProject).toHaveBeenCalledWith(
        mockPayload.projectId
      );
      expect(userService.getUserById).not.toHaveBeenCalled();
    });

    it("Should throw Bad Request if user does not exist", async () => {
      // Prepare
      projectService.getProject = jest.fn().mockResolvedValue(mockProject);
      userService.getUserById = jest.fn().mockResolvedValueOnce(null);

      await expect(taskService.createTask(mockPayload)).rejects.toThrow(
        new BadRequestException("User creates this task is invalid")
      );

      // Assert
      expect(projectService.getProject).toHaveBeenCalledWith(
        mockPayload.projectId
      );
      expect(userService.getUserById).toHaveBeenCalledWith(
        mockPayload.createdBy
      );
    });

    it("Should throw Bad Request if assignee does not exist", async () => {
      // Prepare
      projectService.getProject = jest.fn().mockResolvedValue(mockProject);
      userService.getUserById = jest
        .fn()
        .mockResolvedValueOnce(mockCreatedBy)
        .mockResolvedValueOnce(null);

      await expect(taskService.createTask(mockPayload)).rejects.toThrow(
        new BadRequestException("Assignee is invalid")
      );

      // Assert
      expect(projectService.getProject).toHaveBeenCalledWith(
        mockPayload.projectId
      );
      expect(userService.getUserById).toHaveBeenCalledWith(
        mockPayload.createdBy
      );
      expect(userService.getUserById).toHaveBeenCalledWith(
        mockPayload.assignedTo
      );
      expect(taskRepository.createTask).not.toHaveBeenCalled();
    });

    it("Should create a task without assignee", async () => {
      // Prepare
      const payloadWithoutAssignee = { ...mockPayload, assignedTo: undefined };
      projectService.getProject = jest.fn().mockResolvedValue(mockProject);
      userService.getUserById = jest.fn().mockResolvedValueOnce(mockCreatedBy);
      taskRepository.createTask = jest.fn().mockResolvedValue({
        ...mockCreatedTask,
        assignee: undefined,
      });

      const result = await taskService.createTask(payloadWithoutAssignee);

      // Assert
      expect(projectService.getProject).toHaveBeenCalledWith(
        mockPayload.projectId
      );
      expect(userService.getUserById).toHaveBeenCalledWith(
        mockPayload.createdBy
      );
      expect(result).toEqual({
        ...mockCreatedTask,
        assignee: undefined,
      });
    });
  });

  describe("getAllTasks", () => {
    const mockPayload = {
      title: "Test task",
      createdBy: "user-id",
      limit: 10,
      skip: 0,
    };

    const mockTasks = {
      total: 1,
      data: [
        {
          id: "task-id",
          title: "Test task",
          createdBy: { id: "user-id" },
        },
      ],
    };

    it("Should return all tasks matching the criteria", async () => {
      // Prepare
      taskRepository.findTasks = jest.fn().mockResolvedValue(mockTasks);

      const result = await taskService.getAllTasks(mockPayload);

      // Assert
      expect(taskRepository.findTasks).toHaveBeenCalledWith(mockPayload);
      expect(result).toEqual(mockTasks);
    });
  });

  describe("getTask", () => {
    const taskId = "task-id";
    const mockTask = {
      id: taskId,
      title: "Test task",
      createdBy: { id: "user-id" },
    };

    it("Should return a task when it exists", async () => {
      taskRepository.findById = jest.fn().mockResolvedValue(mockTask);

      const result = await taskService.getTask(taskId);

      expect(result).toEqual(mockTask);
    });

    it("Should throw Not Found when task does not exist", async () => {
      taskRepository.findById = jest.fn().mockResolvedValue(null);

      await expect(taskService.getTask(taskId)).rejects.toThrow(
        new NotFoundException("Task not found")
      );
    });
  });

  describe("updateTask", () => {
    const mockPayload = {
      id: "task-id",
      title: "Test task",
      description: "Test description",
      createdBy: "user-id",
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      assignedTo: "assignee-id",
    };

    const mockTask = {
      id: "task-id",
      title: "Test task",
      createdBy: { id: "user-id" },
    };

    const mockAssignee = { id: "assignee-id" };
    const mockUpdateResult = { affected: 1 };

    it("Should update a task", async () => {
      // Prepare
      taskRepository.findById = jest.fn().mockResolvedValue(mockTask);
      userService.getUserById = jest.fn().mockResolvedValue(mockAssignee);
      taskRepository.updateTask = jest.fn().mockResolvedValue(mockUpdateResult);

      const result = await taskService.updateTask(mockPayload);

      // Assert
      expect(taskRepository.findById).toHaveBeenCalledWith(mockPayload.id);
      expect(result).toEqual(mockUpdateResult);
    });

    it("Should throw Bad Request if user is not the creator", async () => {
      const taskWithDifferentCreator = {
        ...mockTask,
        createdBy: { id: "different-user-id" },
      };

      taskRepository.findById = jest
        .fn()
        .mockResolvedValue(taskWithDifferentCreator);

      await expect(taskService.updateTask(mockPayload)).rejects.toThrow(
        new BadRequestException("User cannot update this task")
      );
    });

    it("Should throw Bad Request if assignee does not exist", async () => {
      taskRepository.findById = jest.fn().mockResolvedValue(mockTask);
      userService.getUserById = jest.fn().mockResolvedValue(null);

      await expect(taskService.updateTask(mockPayload)).rejects.toThrow(
        new BadRequestException("Assignee is invalid")
      );
    });

    it("Should update task without assignee", async () => {
      const payloadWithoutAssignee = { ...mockPayload, assignedTo: undefined };
      taskRepository.findById = jest.fn().mockResolvedValue(mockTask);
      taskRepository.updateTask = jest.fn().mockResolvedValue(mockUpdateResult);

      const result = await taskService.updateTask(payloadWithoutAssignee);

      expect(result).toEqual(mockUpdateResult);
    });
  });

  describe("deleteTask", () => {
    const deletePayload = {
      id: "task-id",
      createdBy: "user-id",
    };

    const mockTask = {
      id: "task-id",
      title: "Test task",
      createdBy: { id: "user-id" },
    };

    const mockDeleteResult = { affected: 1 };

    it("Should delete a task", async () => {
      // Prepare
      taskRepository.findById = jest.fn().mockResolvedValue(mockTask);
      taskRepository.deleteTask = jest.fn().mockResolvedValue(mockDeleteResult);

      const result = await taskService.deleteTask(deletePayload);

      // Assert
      expect(result).toEqual(mockDeleteResult);
    });

    it("Should throw Bad Request if user is not the creator", async () => {
      // Prepare
      const taskWithDifferentCreator = {
        ...mockTask,
        createdBy: { id: "different-user-id" },
      };
      taskRepository.findById = jest
        .fn()
        .mockResolvedValue(taskWithDifferentCreator);

      await expect(taskService.deleteTask(deletePayload)).rejects.toThrow(
        new BadRequestException("User cannot delete this task")
      );

      // Assert
      expect(taskRepository.findById).toHaveBeenCalledWith(deletePayload.id);
    });
  });
});

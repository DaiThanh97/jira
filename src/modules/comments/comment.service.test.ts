import { UserService } from "../users/user.service";
import { CommentService } from "./comment.service";
import { TaskService } from "../tasks/task.service";
import { CommentRepository } from "./comment.repository";
import { TaskEntity } from "../tasks/task.entity";
import { UserEntity } from "../users/user.entity";
import { CommentEntity } from "./comment.entity";
import { BadRequestException, NotFoundException } from "../../utils/error";

jest.mock("./../../utils/environment", () => ({
  Enviroment: {},
}));
jest.mock("./comment.repository");
jest.mock("../tasks/task.service");
jest.mock("../users/user.service");

describe("CommentService", () => {
  let commentService: CommentService;
  let commentRepository: jest.Mocked<CommentRepository>;
  let userService: jest.Mocked<UserService>;
  let taskService: jest.Mocked<TaskService>;

  beforeEach(() => {
    jest.clearAllMocks();

    commentRepository = {
      findById: jest.fn(),
      findCommentsByTaskId: jest.fn(),
      createComment: jest.fn(),
      deleteComment: jest.fn(),
    } as unknown as jest.Mocked<CommentRepository>;

    taskService = {
      getTask: jest.fn(),
    } as unknown as jest.Mocked<TaskService>;

    userService = {
      getUserById: jest.fn(),
    } as unknown as jest.Mocked<UserService>;

    commentService = new CommentService(
      commentRepository,
      taskService,
      userService
    );
  });

  describe("createComment", () => {
    const mockPayload = {
      content: "Test comment content",
      taskId: "task-id",
      createdBy: "user-id",
    };

    const mockTask = {
      id: "task-id",
      title: "Test Task",
    } as TaskEntity;

    const mockUser = {
      id: "user-id",
      name: "Test User",
    } as UserEntity;

    const mockComment = {
      id: "comment-id",
      content: "Test comment content",
      task: mockTask,
      user: mockUser,
      created_at: new Date(),
    } as CommentEntity;

    it("Should create a comment", async () => {
      // Prepare
      taskService.getTask.mockResolvedValue(mockTask);
      userService.getUserById.mockResolvedValue(mockUser);
      commentRepository.createComment.mockResolvedValue(mockComment);

      // Actions
      const result = await commentService.createComment(mockPayload);

      // Assert
      expect(commentRepository.createComment).toHaveBeenCalledWith(
        mockPayload.content,
        mockTask,
        mockUser
      );
      expect(result).toEqual(mockComment);
    });

    it("Should throw Bad Request if task does not exist", async () => {
      // Prepare
      taskService.getTask.mockResolvedValue(null);

      // Actions
      await expect(commentService.createComment(mockPayload)).rejects.toThrow(
        new BadRequestException("Task not exists")
      );
      expect(userService.getUserById).not.toHaveBeenCalled();
    });
  });

  describe("getAllComments", () => {
    const mockPayload = {
      taskId: "task-id",
      limit: 10,
      skip: 0,
    };

    const mockComment = {
      id: "comment-id",
      content: "Test comment content",
      created_at: new Date(),
    } as CommentEntity;

    const mockComments = {
      total: 1,
      data: [mockComment],
    };

    it("Should return all comments for a task", async () => {
      // Prepare
      commentRepository.findCommentsByTaskId.mockResolvedValue(mockComments);

      const result = await commentService.getAllComments(mockPayload);

      expect(result).toEqual(mockComments);
    });
  });

  describe("deleteComment", () => {
    const commentId = "comment-id";
    const mockComment = {
      id: commentId,
      content: "Test comment content",
      created_at: new Date(),
    } as CommentEntity;

    it("Should delete a comment when it exists", async () => {
      // Prepare
      commentRepository.findById.mockResolvedValue(mockComment);

      // Actions
      await commentService.deleteComment(commentId);

      expect(commentRepository.findById).toHaveBeenCalledWith(commentId);
      expect(commentRepository.deleteComment).toHaveBeenCalledWith(commentId);
    });

    it("Should throw Not Found when comment does not exist", async () => {
      // Prepare
      commentRepository.findById.mockResolvedValue(null);

      // Actions
      await expect(commentService.deleteComment(commentId)).rejects.toThrow(
        new NotFoundException("Comment not found")
      );

      expect(commentRepository.findById).toHaveBeenCalledWith(commentId);
      expect(commentRepository.deleteComment).not.toHaveBeenCalled();
    });
  });
});

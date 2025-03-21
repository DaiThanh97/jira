import { Service } from "typedi";
import { CommentRepository } from "./comment.repository";
import {
  CreateCommentPayload,
  GetAllCommentsPayload,
} from "./comment.validation";
import { TaskService } from "../tasks/task.service";
import { BadRequestException, NotFoundException } from "../../utils/error";
import { UserService } from "../users/user.service";

@Service()
export class CommentService {
  constructor(
    private commentRepository: CommentRepository,
    private taskService: TaskService,
    private userService: UserService
  ) {}

  async createComment(payload: CreateCommentPayload) {
    const task = await this.taskService.getTask(payload.taskId);

    if (!task) {
      throw new BadRequestException("Task not exists");
    }

    const createdBy = await this.userService.getUserById(payload.createdBy);

    return this.commentRepository.createComment(
      payload.content,
      task,
      createdBy!
    );
  }

  async getAllComments(payload: GetAllCommentsPayload) {
    return this.commentRepository.findCommentsByTaskId(payload);
  }

  async deleteComment(id: string) {
    const comment = await this.commentRepository.findById(id);

    if (!comment) {
      throw new NotFoundException("Comment not found");
    }

    return this.commentRepository.deleteComment(id);
  }
}

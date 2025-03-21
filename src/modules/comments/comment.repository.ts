import { Repository } from "typeorm";
import { Service } from "typedi";
import { AppDataSource } from "../../configs/database.config";
import { CommentEntity } from "./comment.entity";
import { TaskEntity } from "../tasks/task.entity";
import { UserEntity } from "../users/user.entity";
import { IListResponse } from "../../common/interfaces";
import { GetAllCommentsPayload } from "./comment.validation";

@Service()
export class CommentRepository extends Repository<CommentEntity> {
  constructor() {
    super(CommentEntity, AppDataSource.manager);
  }

  async findById(id: string): Promise<CommentEntity | null> {
    return this.findOne({
      where: {
        id,
      },
    });
  }

  async createComment(
    content: string,
    task: TaskEntity,
    createdBy: UserEntity
  ) {
    const newComment = new CommentEntity();
    newComment.content = content;
    newComment.task = task;
    newComment.user = createdBy;

    return this.save(newComment);
  }

  async findCommentsByTaskId({
    taskId,
    skip,
    limit,
  }: GetAllCommentsPayload): Promise<IListResponse<CommentEntity>> {
    const [comments, total] = await this.findAndCount({
      where: {
        task: {
          id: taskId,
        },
      },
      take: limit,
      skip,
    });

    return {
      total,
      data: comments,
    };
  }

  async deleteComment(id: string) {
    this.delete(id);
  }
}

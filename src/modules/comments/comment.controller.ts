import { Service } from "typedi";
import { Request, Response, NextFunction } from "express";
import { CommentService } from "./comment.service";
import { asyncHandler } from "../../middlewares/async-handler.middleware";
import { IRequestUser } from "../../common/interfaces";
import {
  createCommentSchema,
  deleteCommentSchema,
  getAllCommentsSchema,
} from "./comment.validation";
import { HttpStatus } from "../../configs/http.config";
import { DEFAULT_LIMIT } from "../../common/constants";

@Service()
export class CommentController {
  constructor(private commentService: CommentService) {}

  createComment = asyncHandler(
    async (req: IRequestUser, res: Response, next: NextFunction) => {
      const body = createCommentSchema.parse({
        ...req.body,
        createdBy: req.user.id,
      });

      const comment = await this.commentService.createComment(body);

      res.status(HttpStatus.CREATED).json({
        message: "Comment created successfully",
        data: comment,
      });
    }
  );

  getAllComments = asyncHandler(
    async (req: IRequestUser, res: Response, next: NextFunction) => {
      const param = getAllCommentsSchema.parse({
        taskId: req.params.id,
        limit: Number(req.query?.limit) ?? DEFAULT_LIMIT,
        skip: Number(req.query?.skip) ?? 0,
      });

      const comments = await this.commentService.getAllComments(param);

      res.status(HttpStatus.OK).json({
        message: "Comments fetched successfully",
        data: comments,
      });
    }
  );

  deleteComment = asyncHandler(
    async (req: IRequestUser, res: Response, next: NextFunction) => {
      const param = deleteCommentSchema.parse({
        id: req.params.id,
      });

      await this.commentService.deleteComment(param.id);

      res.status(HttpStatus.OK).json({
        message: "Comment deleted successfully",
      });
    }
  );
}

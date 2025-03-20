import { Service } from "typedi";
import { ProjectUserService } from "./project-user.service";
import { asyncHandler } from "../../middlewares/async-handler.middleware";
import {
  addUserToProjectSchema,
  removeUserFromProjectSchema,
} from "./project-user.validation";
import { IRequestUser } from "../../common/interfaces";
import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../configs/http.config";

@Service()
export class ProjectUserController {
  constructor(private projectUserService: ProjectUserService) {}

  addUserToProject = asyncHandler(
    async (req: IRequestUser, res: Response, next: NextFunction) => {
      const body = addUserToProjectSchema.parse({
        ...req.body,
        projectId: req.params.id,
        createdBy: req.user.id,
      });

      await this.projectUserService.addUserToProject(body);

      res.status(HttpStatus.CREATED).json({
        message: "Added user to project successfully",
      });
    }
  );

  removeUserFromProject = asyncHandler(
    async (req: IRequestUser, res: Response, next: NextFunction) => {
      const params = removeUserFromProjectSchema.parse({
        userId: req.params.userId,
        projectId: req.params.projectId,
        createdBy: req.user.id,
      });

      await this.projectUserService.removeUserFromProject(params);

      res.status(HttpStatus.OK).json({
        message: "Remove user from project successfully",
      });
    }
  );
}

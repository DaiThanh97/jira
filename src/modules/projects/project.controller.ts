import { Service } from "typedi";
import { Request, Response, NextFunction } from "express";
import { ProjectService } from "./project.service";
import { asyncHandler } from "../../middlewares/async-handler.middleware";
import { IRequestUser } from "../../common/interfaces";
import {
  createProjectSchema,
  getAllProjectsSchema,
  getProjectSchema,
  updateProjectSchema,
} from "./project.validation";
import { HttpStatus } from "../../configs/http.config";
import { DEFAULT_LIMIT } from "../../common/constants";

@Service()
export class ProjectController {
  constructor(private projectSerice: ProjectService) {}

  createProject = asyncHandler(
    async (req: IRequestUser, res: Response, next: NextFunction) => {
      const body = createProjectSchema.parse({
        ...req.body,
        createdBy: req.user.id,
      });

      const project = await this.projectSerice.createProject(body);

      res.status(HttpStatus.CREATED).json({
        message: "Project created successfully",
        data: project,
      });
    }
  );

  getProjects = asyncHandler(
    async (req: IRequestUser, res: Response, next: NextFunction) => {
      const query = getAllProjectsSchema.parse({
        ...req.query,
        limit: Number(req.query?.limit) ?? DEFAULT_LIMIT,
        skip: Number(req.query?.skip) ?? 0,
      });

      const projects = await this.projectSerice.getProjects(query);

      res.status(HttpStatus.OK).json({
        message: "Fetch projects successfully",
        data: projects,
      });
    }
  );

  getProject = asyncHandler(
    async (req: IRequestUser, res: Response, next: NextFunction) => {
      const param = getProjectSchema.parse(req.params);
      const project = await this.projectSerice.getProject(param.id);

      res.status(HttpStatus.OK).json({
        message: "Fetch project successfully",
        data: project,
      });
    }
  );

  updateProject = asyncHandler(
    async (req: IRequestUser, res: Response, next: NextFunction) => {
      const body = updateProjectSchema.parse({
        ...req.body,
        id: req.params.id,
        createdBy: req.user.id,
      });

      await this.projectSerice.updateProject(body);

      res.status(HttpStatus.OK).json({
        message: "Project updated successfully",
      });
    }
  );

  deleteProject = asyncHandler(
    async (req: IRequestUser, res: Response, next: NextFunction) => {
      const param = getProjectSchema.parse(req.params);
      const createdBy = req.user.id;

      await this.projectSerice.deleteProject(param.id, createdBy);

      res.status(HttpStatus.OK).json({
        message: "Project deleted successfully",
      });
    }
  );
}

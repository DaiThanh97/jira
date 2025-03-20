import { Router } from "express";
import Container from "typedi";
import { ProjectUserController } from "./project-user.controller";

const projectUserRoutes = Router();
const projectUserController = Container.get(ProjectUserController);

projectUserRoutes.post("/:id", projectUserController.addUserToProject);
projectUserRoutes.delete(
  "/:projectId/users/:userId",
  projectUserController.removeUserFromProject
);

export default projectUserRoutes;

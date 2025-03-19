import { Router } from "express";
import Container from "typedi";
import { ProjectController } from "./project.controller";

const projectRoutes = Router();
const projectController = Container.get(ProjectController);

projectRoutes.post("/", projectController.createProject);
projectRoutes.get("/", projectController.getProjects);
projectRoutes.get("/:id", projectController.getProject);
projectRoutes.put("/:id", projectController.updateProject);
projectRoutes.delete("/:id", projectController.deleteProject);

export default projectRoutes;

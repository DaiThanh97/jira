import { Router } from "express";
import authRoutes from "./modules/auth/auth.route";
import organizationRoutes from "./modules/organizations/organization.route";
import isAuthenticated from "./middlewares/authenticated.middleware";
import organizationUserRoutes from "./modules/organizations-users/organization-user.route";
import projectRoutes from "./modules/projects/project.route";
import projectUserRoutes from "./modules/projects-users/project-user.route";
import taskRoutes from "./modules/tasks/task.route";
import commentRoutes from "./modules/comments/comment.route";

enum APP_ROUTE {
  AUTH = "/auth",
  ORGANIZATIONS = "/organizations",
  ORGANIZATIONS_USERS = "/organizations-users",
  PROJECTS = "/projects",
  PROJECTS_USERS = "/projects-users",
  TASKS = "/tasks",
  COMMENTS = "/comments",
}

const allRoutes = Router();

allRoutes.use(APP_ROUTE.AUTH, authRoutes);
allRoutes.use(APP_ROUTE.ORGANIZATIONS, isAuthenticated, organizationRoutes);
allRoutes.use(
  APP_ROUTE.ORGANIZATIONS_USERS,
  isAuthenticated,
  organizationUserRoutes
);
allRoutes.use(APP_ROUTE.PROJECTS, isAuthenticated, projectRoutes);
allRoutes.use(APP_ROUTE.PROJECTS_USERS, isAuthenticated, projectUserRoutes);
allRoutes.use(APP_ROUTE.TASKS, isAuthenticated, taskRoutes);
allRoutes.use(APP_ROUTE.COMMENTS, isAuthenticated, commentRoutes);

export default allRoutes;

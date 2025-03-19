import { Router } from "express";
import authRoutes from "./modules/auth/auth.route";
import organizationRoutes from "./modules/organizations/organization.route";
import isAuthenticated from "./middlewares/authenticated.middleware";
import organizationUserRoutes from "./modules/organizations-users/organization-user.route";
import projectRoutes from "./modules/projects/project.route";

enum APP_ROUTE {
  AUTH = "/auth",
  ORGANIZATIONS = "/organizations",
  ORGANIZATIONS_USERS = "/organizations-users",
  PROJECTS = "/projects",
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

export default allRoutes;

import { Router } from "express";
import authRoutes from "./modules/auth/auth.route";
import organizationRoutes from "./modules/organizations/organization.route";
import isAuthenticated from "./middlewares/authenticated.middleware";

enum APP_ROUTE {
  AUTH = "/auth",
  ORGANIZATIONS = "/organizations",
}

const allRoutes = Router();

allRoutes.use(APP_ROUTE.AUTH, authRoutes);
allRoutes.use(APP_ROUTE.ORGANIZATIONS, isAuthenticated, organizationRoutes);

export default allRoutes;

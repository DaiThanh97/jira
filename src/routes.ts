import { Router } from "express";
import authRoutes from "./modules/auth/auth.route";

enum APP_ROUTE {
  AUTH = "/auth",
}

const allRoutes = Router();

allRoutes.use(APP_ROUTE.AUTH, authRoutes);

export default allRoutes;

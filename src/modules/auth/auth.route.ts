import { Router } from "express";
import Container from "typedi";
import { AuthController } from "./auth.controller";

const authRoutes = Router();
const authController = Container.get(AuthController);

// /api/v1/auth/register
authRoutes.post("/register", authController.register);
authRoutes.post("/login", authController.register);

export default authRoutes;

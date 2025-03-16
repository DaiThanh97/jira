import { Service } from "typedi";
import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../middlewares/async-handler.middleware";
import { loginSchema, registerSchema } from "./auth.validation";
import { AuthService } from "./auth.service";
import { HttpStatus } from "../../configs/http.config";

@Service()
export class AuthController {
  constructor(private authService: AuthService) {}

  register = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const body = registerSchema.parse(req.body);

      await this.authService.register(body);

      return res.status(HttpStatus.CREATED).json({
        message: "Uesr registered successfully",
      });
    }
  );

  login = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const body = loginSchema.parse(req.body);

      const user = await this.authService.login(body);

      return res.status(HttpStatus.OK).json({
        message: "Uesr logged in successfully",
        data: user,
      });
    }
  );
}

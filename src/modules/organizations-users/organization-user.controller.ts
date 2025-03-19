import { Request, Response, NextFunction } from "express";
import { Service } from "typedi";
import { OrganizationUserService } from "./organization-user.service";
import { asyncHandler } from "../../middlewares/async-handler.middleware";
import { IRequestUser } from "../../common/interfaces";
import {
  addUserToOrganizationSchema,
  removeUserFromOrganizationSchema,
} from "./organization-user.validation";
import { HttpStatus } from "../../configs/http.config";

@Service()
export class OrganizationUserController {
  constructor(private organizationUserService: OrganizationUserService) {}

  addUserToOrganization = asyncHandler(
    async (req: IRequestUser, res: Response, next: NextFunction) => {
      const body = addUserToOrganizationSchema.parse({
        ...req.body,
        createdBy: req.user.id,
      });

      // Service
      const organizationUser =
        await this.organizationUserService.addUserToOrganization(body);

      res.status(HttpStatus.CREATED).json({
        message: "Added user to organization successfully",
        data: organizationUser,
      });
    }
  );

  removeUserFromOrganization = asyncHandler(
    async (req: IRequestUser, res: Response, next: NextFunction) => {
      const body = removeUserFromOrganizationSchema.parse({
        ...req.body,
        createdBy: req.user.id,
      });

      // Service
      await this.organizationUserService.removeUserFromOrganization(body);

      res.status(HttpStatus.CREATED).json({
        message: "Removed user from organization successfully",
      });
    }
  );
}

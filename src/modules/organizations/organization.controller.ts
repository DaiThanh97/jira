import { Service } from "typedi";
import { OrganizationService } from "./organization.service";
import { asyncHandler } from "../../middlewares/async-handler.middleware";
import { Request, Response, NextFunction } from "express";
import {
  createOrganizationSchema,
  getAllOrganizationsSchema,
  getOrganizationSchema,
  updateOrganizationSchema,
} from "./organization.validation";
import { IRequestUser } from "../../common/interfaces";
import { HttpStatus } from "../../configs/http.config";
import { DEFAULT_LIMIT } from "../../common/constants";

@Service()
export class OrganizationController {
  constructor(private organizationSerice: OrganizationService) {}

  createOrganization = asyncHandler(
    async (req: IRequestUser, res: Response, next: NextFunction) => {
      const body = createOrganizationSchema.parse({
        ...req.body,
        createdBy: req.user.id,
      });

      const organization = await this.organizationSerice.createOrganization(
        body
      );

      res.status(HttpStatus.CREATED).json({
        message: "Organization created successfully",
        data: organization,
      });
    }
  );

  getOrganizations = asyncHandler(
    async (req: IRequestUser, res: Response, next: NextFunction) => {
      const query = getAllOrganizationsSchema.parse({
        ...req.query,
        limit: Number(req.query?.limit) ?? DEFAULT_LIMIT,
        skip: Number(req.query?.skip) ?? 0,
      });

      const organizations = await this.organizationSerice.getOrganizations(
        query
      );

      res.status(HttpStatus.OK).json({
        message: "Fetch organizations successfully",
        data: organizations,
      });
    }
  );

  getOrganization = asyncHandler(
    async (req: IRequestUser, res: Response, next: NextFunction) => {
      const params = getOrganizationSchema.parse(req.params);

      const organization = await this.organizationSerice.getOrganization(
        params.id
      );

      res.status(HttpStatus.OK).json({
        message: "Fetch organization successfully",
        data: organization,
      });
    }
  );

  updateOrganization = asyncHandler(
    async (req: IRequestUser, res: Response, next: NextFunction) => {
      const body = updateOrganizationSchema.parse({
        ...req.body,
        id: req.params.id,
        createdBy: req.user.id,
      });

      await this.organizationSerice.updateOrganization(body);

      res.status(HttpStatus.OK).json({
        message: "Organization updated successfully",
      });
    }
  );

  deleteOrganization = asyncHandler(
    async (req: IRequestUser, res: Response, next: NextFunction) => {
      const params = getOrganizationSchema.parse(req.params);

      await this.organizationSerice.deleteOrganization(params.id, req.user.id);

      res.status(HttpStatus.OK).json({
        message: "Organization deleted successfully",
      });
    }
  );
}

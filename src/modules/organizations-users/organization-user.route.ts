import { Router } from "express";
import Container from "typedi";
import { OrganizationUserController } from "./organization-user.controller";

const organizationUserRoutes = Router();
const organizationUserController = Container.get(OrganizationUserController);

organizationUserRoutes.post(
  "/",
  organizationUserController.addUserToOrganization
);
organizationUserRoutes.delete(
  "/",
  organizationUserController.removeUserFromOrganization
);

export default organizationUserRoutes;

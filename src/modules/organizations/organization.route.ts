import { Router } from "express";
import Container from "typedi";
import { OrganizationController } from "./organization.controller";

const organizationRoutes = Router();
const organizationController = Container.get(OrganizationController);

organizationRoutes.post("/", organizationController.createOrganization);
organizationRoutes.get("/", organizationController.getOrganizations);
organizationRoutes.get("/:id", organizationController.getOrganization);
organizationRoutes.put("/:id", organizationController.updateOrganization);
organizationRoutes.delete("/:id", organizationController.deleteOrganization);

export default organizationRoutes;

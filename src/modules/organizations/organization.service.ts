import { Service } from "typedi";
import { OrganizationRepository } from "./organization.repository";
import {
  CreateOrganizationPayload,
  GetAllOrganizationsPayload,
  UpdateOrganizationPayload,
} from "./organization.validation";
import { BadRequestException, NotFoundException } from "../../utils/error";

@Service()
export class OrganizationService {
  constructor(private organizationRepository: OrganizationRepository) {}

  async createOrganization(payload: CreateOrganizationPayload) {
    const existingOrganization = await this.organizationRepository.findByName(
      payload.name
    );

    if (existingOrganization) {
      throw new BadRequestException("Organization name already exists");
    }

    return this.organizationRepository.createOrganization(payload);
  }

  async getOrganizations(payload: GetAllOrganizationsPayload) {
    return this.organizationRepository.findOrganizations(payload);
  }

  async getOrganization(id: string) {
    const organization = await this.organizationRepository.findById(id);

    if (!organization) {
      throw new NotFoundException("Organization not found!");
    }

    return organization;
  }

  async updateOrganization(payload: UpdateOrganizationPayload) {
    const organization = await this.organizationRepository.findById(payload.id);

    if (!organization) {
      throw new NotFoundException("Organization not found!");
    }

    if (payload.createdBy !== organization.created_by) {
      throw new BadRequestException("User cannot update this organization");
    }

    await this.organizationRepository.updateOrganization(payload);
  }

  async deleteOrganization(id: string, userId: string) {
    const organization = await this.organizationRepository.findById(id);

    if (!organization) {
      throw new NotFoundException("Organization not found!");
    }

    if (userId !== organization.created_by) {
      throw new BadRequestException("User cannot delete this organization");
    }

    await this.organizationRepository.deleteOrganization(id);
  }
}

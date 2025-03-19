import { Service } from "typedi";
import { OrganizationUserRepository } from "./organization-user.repository";
import { AddUserToOrganizationPayload } from "./organization-user.validation";
import { OrganizationUserEntity } from "./organization-user.entity";
import { BadRequestException } from "../../utils/error";
import { OrganizationService } from "../organizations/organization.service";

@Service()
export class OrganizationUserService {
  constructor(
    private organizationUserRepository: OrganizationUserRepository,
    private organizationService: OrganizationService
  ) {}

  async addUserToOrganization({
    userId,
    organizationId,
    createdBy,
  }: AddUserToOrganizationPayload): Promise<OrganizationUserEntity> {
    const existingOrganizationUser =
      await this.organizationUserRepository.findOrganizationAndUser(
        organizationId,
        userId
      );

    if (existingOrganizationUser) {
      throw new BadRequestException("User is already in organization");
    }

    // Check if creator has permission to add user
    const organization = await this.organizationService.getOrganization(
      organizationId
    );

    if (organization.created_by !== createdBy) {
      throw new BadRequestException(
        "Not allow to add user to this organization"
      );
    }

    return this.organizationUserRepository.createOrganizationUser(
      organizationId,
      userId
    );
  }

  async removeUserFromOrganization({
    userId,
    organizationId,
    createdBy,
  }: AddUserToOrganizationPayload) {
    const existingOrganizationUser =
      await this.organizationUserRepository.findOrganizationAndUser(
        organizationId,
        userId
      );

    if (!existingOrganizationUser) {
      throw new BadRequestException("User is not in organization");
    }

    // Check if creator has permission to add user
    const organization = await this.organizationService.getOrganization(
      organizationId
    );

    if (organization.created_by !== createdBy) {
      throw new BadRequestException(
        "Not allow to remove user from this organization"
      );
    }

    return this.organizationUserRepository.deleteOrganizationUser(
      existingOrganizationUser.id
    );
  }
}

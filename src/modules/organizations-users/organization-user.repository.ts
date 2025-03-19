import { Service } from "typedi";
import { Repository } from "typeorm";
import { AppDataSource } from "../../configs/database.config";
import { OrganizationUserEntity } from "./organization-user.entity";

@Service()
export class OrganizationUserRepository extends Repository<OrganizationUserEntity> {
  constructor() {
    super(OrganizationUserEntity, AppDataSource.manager);
  }

  async findOrganizationAndUser(
    organizationId: string,
    userId: string
  ): Promise<OrganizationUserEntity | null> {
    return this.findOne({
      where: {
        organization_id: organizationId,
        user_id: userId,
      },
    });
  }

  async createOrganizationUser(
    organizationId: string,
    userId: string
  ): Promise<OrganizationUserEntity> {
    const organizationUser = new OrganizationUserEntity();
    organizationUser.organization_id = organizationId;
    organizationUser.user_id = userId;
    return this.save(organizationUser);
  }

  async deleteOrganizationUser(id: string) {
    return this.delete(id);
  }
}

import { Service } from "typedi";
import { Repository } from "typeorm";
import { OrganizationEntity } from "./organization.entity";
import {
  CreateOrganizationPayload,
  GetAllOrganizationsPayload,
  UpdateOrganizationPayload,
} from "./organization.validation";
import { IListResponse } from "../../common/interfaces";
import { AppDataSource } from "../../configs/database.config";

@Service()
export class OrganizationRepository extends Repository<OrganizationEntity> {
  constructor() {
    super(OrganizationEntity, AppDataSource.manager);
  }

  async findByName(name: string): Promise<OrganizationEntity | null> {
    return this.findOne({
      where: {
        name,
      },
    });
  }
  async findById(id: string): Promise<OrganizationEntity | null> {
    return this.findOne({
      where: {
        id,
      },
    });
  }
  async createOrganization(organization: CreateOrganizationPayload) {
    const newOrg = new OrganizationEntity();
    newOrg.name = organization.name;
    newOrg.created_by = organization.createdBy;
    return this.save(newOrg);
  }
  async findOrganizations({
    name,
    createdBy,
    skip,
    limit,
  }: GetAllOrganizationsPayload): Promise<IListResponse<OrganizationEntity>> {
    const [organizations, total] = await this.findAndCount({
      where: {
        ...(name && { name }),
        ...(createdBy && { created_by: createdBy }),
      },
      take: limit,
      skip,
    });

    return {
      total,
      data: organizations,
    };
  }
  async updateOrganization({ id, name }: UpdateOrganizationPayload) {
    return this.update(id, {
      name,
    });
  }
  async deleteOrganization(id: string) {
    // In real world scenario we must follow the soft-delete pattern
    // Instead of hard delete to avoid data loss.
    return this.delete(id);
  }
}

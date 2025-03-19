import { Service } from "typedi";
import { Repository } from "typeorm";
import { ProjectEntity } from "./project.entity";
import { AppDataSource } from "../../configs/database.config";
import {
  CreateProjectPayload,
  GetAllProjectsPayload,
  UpdateProjectPayload,
} from "./project.validation";
import { OrganizationEntity } from "../organizations/organization.entity";
import { UserEntity } from "../users/user.entity";
import { IListResponse } from "../../common/interfaces";

@Service()
export class ProjectRepository extends Repository<ProjectEntity> {
  constructor() {
    super(ProjectEntity, AppDataSource.manager);
  }

  async findByName(name: string): Promise<ProjectEntity | null> {
    return this.findOne({
      where: {
        name,
      },
    });
  }

  async createProject(
    project: CreateProjectPayload,
    organization: OrganizationEntity,
    createdBy: UserEntity
  ) {
    const newProject = new ProjectEntity();
    newProject.name = project.name;
    newProject.description = project.description;
    newProject.organization = organization;
    newProject.createdBy = createdBy;

    const createdProject = await this.save(newProject);
    return createdProject.toJSON();
  }

  async findProjects({
    name,
    createdBy,
    skip,
    limit,
  }: GetAllProjectsPayload): Promise<IListResponse<ProjectEntity>> {
    const [projects, total] = await this.findAndCount({
      where: {
        ...(name && { name }),
        ...(createdBy && { "createdBy.id": createdBy }),
      },
      take: limit,
      skip,
    });

    return {
      total,
      data: projects,
    };
  }

  async findById(id: string): Promise<ProjectEntity | null> {
    return this.findOne({
      where: {
        id,
      },
    });
  }

  async updateProject({ name, description, id }: UpdateProjectPayload) {
    return this.update(id, {
      name,
      description,
    });
  }

  async deleteProject(id: string) {
    return this.delete(id);
  }
}

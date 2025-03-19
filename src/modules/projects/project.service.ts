import { Service } from "typedi";
import { ProjectRepository } from "./project.repository";
import {
  CreateProjectPayload,
  GetAllProjectsPayload,
  UpdateProjectPayload,
} from "./project.validation";
import { BadRequestException, NotFoundException } from "../../utils/error";
import { OrganizationService } from "../organizations/organization.service";
import { UserService } from "../users/user.service";

@Service()
export class ProjectService {
  constructor(
    private projectRepository: ProjectRepository,
    private organizationService: OrganizationService,
    private userService: UserService
  ) {}

  async createProject(payload: CreateProjectPayload) {
    const existingProject = await this.projectRepository.findByName(
      payload.name
    );

    if (existingProject) {
      throw new BadRequestException("Project name already exists");
    }

    const existingOrganization = await this.organizationService.getOrganization(
      payload.organizationId
    );

    if (!existingOrganization) {
      throw new BadRequestException("Organization not exists");
    }

    const createdBy = await this.userService.getUserById(payload.createdBy);

    return this.projectRepository.createProject(
      payload,
      existingOrganization,
      createdBy!
    );
  }

  async getProjects(payload: GetAllProjectsPayload) {
    return this.projectRepository.findProjects(payload);
  }

  async getProject(id: string) {
    const existingProject = await this.projectRepository.findById(id);

    if (!existingProject) {
      throw new NotFoundException("Project not found");
    }

    return existingProject;
  }

  async updateProject(payload: UpdateProjectPayload) {
    const project = await this.getProject(payload.id);

    console.log("PROJECTT: ", project);

    if (payload.createdBy !== project.createdBy.id) {
      throw new BadRequestException("Not allow to update this project");
    }

    return this.projectRepository.updateProject(payload);
  }

  async deleteProject(id: string, createdBy: string) {
    const project = await this.getProject(id);

    if (createdBy !== project.createdBy.id) {
      throw new BadRequestException("Not allow to delete this project");
    }

    return this.projectRepository.deleteProject(id);
  }
}

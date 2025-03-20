import { Service } from "typedi";
import { ProjectUserRepository } from "./project-user.repository";
import {
  AddUserToProjectPayload,
  RemoveUserFromProjectPayload,
} from "./project-user.validation";
import { ProjectService } from "../projects/project.service";
import { BadRequestException, NotFoundException } from "../../utils/error";
import { UserService } from "../users/user.service";

@Service()
export class ProjectUserService {
  constructor(
    private projectUserRepository: ProjectUserRepository,
    private projectService: ProjectService,
    private userService: UserService
  ) {}

  async addUserToProject(payload: AddUserToProjectPayload) {
    const { createdBy, projectId, userId } = payload;

    const project = await this.projectService.getProject(projectId);

    if (!project) {
      throw new NotFoundException("Project not found");
    }

    if (project.createdBy.id !== createdBy) {
      throw new BadRequestException(
        "User not have permission to add to this project"
      );
    }

    const user = await this.userService.getUserById(userId);

    await this.projectUserRepository.createProjectUser(project, user!);
  }

  async removeUserFromProject(payload: RemoveUserFromProjectPayload) {
    const { createdBy, projectId, userId } = payload;

    const project = await this.projectService.getProject(projectId);

    if (!project) {
      throw new NotFoundException("Project not found");
    }

    if (project.createdBy.id !== createdBy) {
      throw new BadRequestException(
        "User not have permission to edit to this project"
      );
    }

    await this.projectUserRepository.removeProjectUser(projectId, userId);
  }
}

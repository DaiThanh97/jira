import { Service } from "typedi";
import { Repository } from "typeorm";
import { ProjectUserEntity } from "./project-user.entity";
import { AppDataSource } from "../../configs/database.config";
import { ProjectEntity } from "../projects/project.entity";
import { UserEntity } from "../users/user.entity";

@Service()
export class ProjectUserRepository extends Repository<ProjectUserEntity> {
  constructor() {
    super(ProjectUserEntity, AppDataSource.manager);
  }

  async createProjectUser(
    project: ProjectEntity,
    user: UserEntity
  ): Promise<ProjectUserEntity> {
    const projectUser = new ProjectUserEntity();
    projectUser.project = project;
    projectUser.user = user;

    return this.save(projectUser);
  }

  async removeProjectUser(projectId: string, userId: string) {
    return this.delete({
      user: {
        id: userId,
      },
      project: {
        id: projectId,
      },
    });
  }
}

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserEntity } from "../users/user.entity";
import { OrganizationEntity } from "../organizations/organization.entity";
import { ProjectEntity } from "../projects/project.entity";

@Entity({ name: "project_user" })
export class ProjectUserEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn({ type: "timestamp" })
  joined_at: Date;

  @ManyToOne(() => UserEntity, (user) => user.projectUsers)
  user: UserEntity;

  @ManyToOne(() => ProjectEntity, (project) => project.projectUsers)
  project: ProjectEntity;
}

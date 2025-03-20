import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { OrganizationEntity } from "../organizations/organization.entity";
import { UserEntity } from "../users/user.entity";
import { ProjectUserEntity } from "../projects-users/project-user.entity";

@Entity({ name: "projects" })
export class ProjectEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;

  @ManyToOne(() => OrganizationEntity, (organization) => organization.projects)
  organization: OrganizationEntity;

  @ManyToOne(() => UserEntity, (user) => user.createdProjects, {
    eager: true,
  })
  createdBy: UserEntity;

  @OneToMany(() => ProjectUserEntity, (projectUser) => projectUser.project)
  projectUsers: ProjectUserEntity[];

  toJSON() {
    const { createdBy, ...rest } = this;
    return rest;
  }
}

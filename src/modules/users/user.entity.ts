import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { compareValue } from "../../utils/bcrypt";
import { OrganizationUserEntity } from "../organizations-users/organization-user.entity";
import { ProjectEntity } from "../projects/project.entity";
import { ProjectUserEntity } from "../projects-users/project-user.entity";
import { TaskEntity } from "../tasks/task.entity";

@Entity({ name: "users" })
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "varchar", unique: true })
  email: string;

  @Column({ type: "varchar" })
  password_hash: string;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;

  @OneToMany(
    () => OrganizationUserEntity,
    (organizationUser) => organizationUser.user
  )
  organizationUsers: OrganizationUserEntity[];

  @OneToMany(() => ProjectEntity, (project) => project.createdBy)
  createdProjects: ProjectEntity[];

  @OneToMany(() => ProjectUserEntity, (projectUser) => projectUser.user)
  projectUsers: ProjectUserEntity[];

  @OneToMany(() => TaskEntity, (task) => task.createdBy)
  createdTasks: TaskEntity[];

  @OneToMany(() => TaskEntity, (task) => task.assignee)
  assignedTasks: TaskEntity[];

  async checkPassword(password: string): Promise<boolean> {
    return compareValue(password, this.password_hash);
  }
}

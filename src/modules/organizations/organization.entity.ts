import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { OrganizationUserEntity } from "../organizations-users/organization-user.entity";
import { ProjectEntity } from "../projects/project.entity";

@Entity({ name: "organizations" })
export class OrganizationEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "uuid" })
  created_by: string;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;

  @OneToMany(
    () => OrganizationUserEntity,
    (organizationUser) => organizationUser.organization
  )
  organizationUsers: OrganizationUserEntity[];

  @OneToMany(() => ProjectEntity, (project) => project.organization)
  projects: ProjectEntity[];
}

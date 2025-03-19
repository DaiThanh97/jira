import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserEntity } from "../users/user.entity";
import { OrganizationEntity } from "../organizations/organization.entity";

@Entity({ name: "organization_user" })
export class OrganizationUserEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("uuid")
  user_id: string;

  @Column("uuid")
  organization_id: string;

  @CreateDateColumn({ type: "timestamp" })
  joined_at: Date;

  @ManyToOne(() => UserEntity, (user) => user.organizationUsers)
  user: UserEntity;

  @ManyToOne(
    () => OrganizationEntity,
    (organization) => organization.organizationUsers
  )
  organization: OrganizationEntity;
}

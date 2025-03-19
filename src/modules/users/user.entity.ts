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

  async checkPassword(password: string): Promise<boolean> {
    return compareValue(password, this.password_hash);
  }
}

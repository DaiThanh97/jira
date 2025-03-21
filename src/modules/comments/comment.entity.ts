import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TaskEntity } from "../tasks/task.entity";
import { UserEntity } from "../users/user.entity";

@Entity({ name: "comments" })
export class CommentEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "text", nullable: true })
  content: string;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @ManyToOne(() => TaskEntity, (task) => task.comments)
  task: TaskEntity;

  @ManyToOne(() => UserEntity, (user) => user.comments)
  user: UserEntity;
}

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { TaskPriority, TaskStatus } from "./task.enum";
import { ProjectEntity } from "../projects/project.entity";
import { UserEntity } from "../users/user.entity";
import { CommentEntity } from "../comments/comment.entity";

@Entity({ name: "tasks" })
export class TaskEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar" })
  title: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column("enum", { enum: Object.values(TaskStatus), default: TaskStatus.TODO })
  status: TaskStatus;

  @Column("enum", {
    enum: Object.values(TaskPriority),
    default: TaskPriority.LOW,
  })
  priority: TaskPriority;

  @CreateDateColumn({ type: "timestamp", nullable: true })
  due_date?: Date;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;

  @ManyToOne(() => ProjectEntity, (project) => project.tasks)
  project: ProjectEntity;

  @ManyToOne(() => UserEntity, (user) => user.createdTasks, {
    eager: true,
  })
  createdBy: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.assignedTasks)
  assignee: UserEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.task)
  comments: CommentEntity[];
}

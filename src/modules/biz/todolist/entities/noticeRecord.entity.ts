import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/modules/auth/entities/user.entity';
import { Task } from './task.entity';
import { NoticeRun } from './noticeRun.entity';

export enum NoticeChannel {
  EMAIL = 'email',
  LETTER = 'letter',
}

export enum NoticeStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
}

@Entity('todo_notice_record')
export class NoticeRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ name: 'userId' })
  userId: number;

  @ManyToOne(() => Task)
  @JoinColumn({ name: 'taskId' })
  task: Task;

  @Column({ name: 'taskId' })
  taskId: number;

  @ManyToOne(() => NoticeRun)
  @JoinColumn({ name: 'runId' })
  run: NoticeRun;

  @Column({ name: 'runId' })
  runId: number;

  @CreateDateColumn({ name: 'sent_at' })
  sentAt: Date;

  @Column({
    name: 'channel',
    type: 'enum',
    enum: NoticeChannel,
    default: NoticeChannel.EMAIL,
  })
  channel: NoticeChannel;

  @Column({
    name: 'status',
    type: 'enum',
    enum: NoticeStatus,
    default: NoticeStatus.SUCCESS,
  })
  status: NoticeStatus;

  @Column({
    name: 'error_message',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  errorMessage: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

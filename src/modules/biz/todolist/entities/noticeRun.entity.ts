import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/modules/auth/entities/user.entity';

export enum NoticeTriggeredBy {
  SYSTEM = 'system',
  ADMIN = 'admin',
}

@Entity('todo_notice_run')
export class NoticeRun {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'run_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  runAt: Date;

  @Column({
    name: 'triggered_by',
    type: 'enum',
    enum: NoticeTriggeredBy,
    default: NoticeTriggeredBy.SYSTEM,
  })
  triggeredBy: NoticeTriggeredBy;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'operator_id' })
  operator: User;

  @Column({ name: 'operator_id', type: 'int', nullable: true })
  operatorId: number | null;

  @Column({ name: 'sent_count', type: 'int', default: 0 })
  sentCount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

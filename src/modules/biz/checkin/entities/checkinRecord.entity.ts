import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../../auth/entities/user.entity';

@Entity('checkin_record')
@Index(['userId', 'checkedAt'], { unique: true })
export class CheckinRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'checked_at', type: 'datetime' })
  checkedAt: Date;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  lat: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  lng: number | null;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}

import { User } from 'src/modules/auth/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

// 标签表
@Entity('snow_word_tags', {
  schema: 'cheese-server',
  comment: '用户单词标签关系表',
})
export class Tag {
  @PrimaryGeneratedColumn({ type: 'int', name: 'tagId' })
  tagId: number;

  @Column('varchar', { name: 'tagName', length: 50 })
  tagName: string;

  @ManyToOne(() => User, (user) => user.tags)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'int', name: 'userId' })
  userId: number;

  @CreateDateColumn({ comment: '创建时间', type: 'timestamp' })
  createTime: Date;
}

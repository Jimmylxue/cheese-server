import { User } from 'src/modules/auth/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Word } from './words.entity';

// 用户单词关系表 - 存储用户个性化的数据
@Entity('snow_user_words', { schema: 'snow-server', comment: '用户单词关系表' })
export class UserWord {
  @PrimaryGeneratedColumn({ type: 'int', name: 'userWordId' })
  userWordId: number;

  @ManyToOne(() => User, (user) => user.userWords)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'int', name: 'userId' })
  userId: number;

  @ManyToOne(() => Word, (word) => word.userWords)
  @JoinColumn({ name: 'wordId' })
  word: Word;

  @Column({ type: 'int', name: 'wordId' })
  wordId: number;

  @Column('text', { name: 'personalNote', nullable: true, comment: '标记' })
  personalNote: string;

  @Column('boolean', {
    name: 'isMastered',
    default: false,
    comment: '是否已绑定',
  })
  isMastered: boolean;

  @CreateDateColumn({ comment: '添加时间', type: 'timestamp' })
  createTime: Date;

  @UpdateDateColumn({ comment: '更新时间', type: 'timestamp' })
  updateTime: Date;
}

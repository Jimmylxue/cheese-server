import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserWord } from './userWord.entity';

// 单词表 - 存储唯一的单词信息
@Entity('snow_words', { schema: 'cheese-server', comment: '唯一单词表' })
export class Word {
  @PrimaryGeneratedColumn({ type: 'int', name: 'wordId' })
  wordId: number;

  @Column('varchar', { name: 'word', length: 45, unique: true })
  word: string;

  @Column('varchar', { name: 'chineseMean', length: 200 })
  chineseMean: string;

  @CreateDateColumn({ comment: '创建时间', type: 'timestamp' })
  createTime: Date;

  @UpdateDateColumn({ comment: '更新时间', type: 'timestamp' })
  updateTime: Date;

  // 关联到用户单词关系表
  @OneToMany(() => UserWord, (userWord) => userWord.word)
  userWords: UserWord[];
}

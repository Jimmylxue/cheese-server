import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../../auth/entities/user.entity';
import { ImgFolder } from './imgFolder.entity';

@Entity('img_resource')
export class ImgResource {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column()
  filename: string;

  @Column({ nullable: true, type: 'int' })
  size: number | null;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  mimetype: string | null;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ name: 'userId' })
  userId: number;

  @ManyToOne(() => ImgFolder, (folder) => folder.images, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'folder_id' })
  folder: ImgFolder;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'is_delete', default: false })
  isDelete: boolean;

  @Column({ name: 'deleted_at', nullable: true, type: 'timestamp' })
  deletedAt: Date | null;

  @Column({ name: 'is_favorite', default: false })
  isFavorite: boolean;
}

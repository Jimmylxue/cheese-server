import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../../auth/entities/user.entity';
import { ImgResource } from './imgResource.entity';
import { ImgFolder } from './imgFolder.entity';

export enum ShareType {
  FILE = 'file',
  FOLDER = 'folder',
}

@Entity('img_share')
export class ImgShare {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 64 })
  token: string;

  @Column({ type: 'enum', enum: ShareType })
  type: ShareType;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => ImgResource, { nullable: true })
  @JoinColumn({ name: 'resource_id' })
  resource: ImgResource;

  @Column({ name: 'resource_id', nullable: true })
  resourceId: number | null;

  @ManyToOne(() => ImgFolder, { nullable: true })
  @JoinColumn({ name: 'folder_id' })
  folder: ImgFolder;

  @Column({ name: 'folder_id', nullable: true })
  folderId: number | null;

  @Column({ type: 'timestamp', nullable: true, name: 'expire_at' })
  expireAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

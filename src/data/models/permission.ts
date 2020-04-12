import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: 'permissions' })
export default class Permission extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'permission_id' })
  id?: number;

  @Column({ name: 'permission_uuid' })
  uuid!: string;

  @Column({ nullable: false })
  title!: string;

  @Column({ nullable: false, name: 'display_name' })
  displayName!: string;

  @CreateDateColumn({ name: 'created_at', select: false })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'last_updated', select: false })
  lastModified?: Date;
}

export interface PermissionInterface {
  id: number;
  title: string;
  displayName: string;
  uuid: string;
  [key: string]: any
}

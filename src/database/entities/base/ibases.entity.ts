import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export abstract class IBaseEntity {
  @CreateDateColumn({
    name: 'created_at',
    default: new Date().toISOString(),
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    default: new Date().toISOString(),
    type: 'timestamp',
  })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', default: null, type: 'timestamp' })
  deletedAt: Date;

  isDeleted(): boolean {
    return this.deletedAt !== null;
  }
}

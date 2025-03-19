import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { IBaseEntity } from './ibases.entity';

export class IBaseWithIdEntity extends IBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
}

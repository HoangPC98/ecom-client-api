import { BeforeInsert, CreateDateColumn } from 'typeorm';

export abstract class IBaseOnlyCreateEntity {
  @CreateDateColumn({
    name: 'created_at',
    default: new Date().toISOString(),
    type: 'timestamp',
  })
  createdAt: Date;
}

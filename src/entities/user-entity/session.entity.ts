import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { DeviceInfo } from 'src/common/types/device.type';
import { IBaseWithIdEntity } from '../base/ibase-with-id.entity';
import { User } from './user.entity';
import { IBaseOnlyCreateEntity } from '../base/ibases-only-created';

@Entity()
export class Session extends IBaseOnlyCreateEntity {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'varchar', nullable: false })
  uid: number;

  // @Column({ type: 'varchar', nullable: true })
  // access_token: string;

  @Column({ type: 'varchar', nullable: true })
  refresh_token: string;

  @Column({ type: 'varchar', nullable: true })
  fcm_token: string;

  @Column({ type: 'varchar', nullable: true })
  device_id: string;

  @Column({ type: 'varchar', nullable: true })
  device_info: DeviceInfo;

  @Column({ type: 'varchar', nullable: true })
  ip_address: string;

  @Column({ type: 'varchar', nullable: true, default: new Date() })
  last_used_at: Date;

  @Column({ type: 'varchar', nullable: true })
  expried_at: Date;

  // @Column({ type: 'varchar', nullable: true })
  // log_out_at: Date;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'uid' })
  user: User;

  @BeforeInsert()
  bfis() {
    if (!this.id) this.id = `sid:${Date.now()}`;
  }
}

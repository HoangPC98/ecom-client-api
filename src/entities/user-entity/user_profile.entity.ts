import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { IBaseWithIdEntity } from '../base/ibase-with-id.entity';
import { DEFAULT_USER_NAME_INIT } from 'src/common/constants/user.constant';
import { EUserGender } from 'src/common/enums/user.enum';
import { User } from './user.entity';

@Entity()
export class UserProfile extends IBaseWithIdEntity {
  private initUserName = DEFAULT_USER_NAME_INIT;

  @Column({ type: 'int', nullable: false })
  uid: number;

  @Column({ type: 'varchar', nullable: true })
  first_nane: string;

  @Column({ type: 'varchar', nullable: true })
  middle_name: string;

  @Column({ type: 'varchar', nullable: true })
  last_name: string;

  @Column({ type: 'varchar', nullable: true })
  fullnane: string;

  @Column({ type: 'smallint', enum: EUserGender, default: EUserGender.MALE })
  gender: EUserGender;

  @Column({ type: 'varchar', nullable: true })
  avatar: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'varchar', nullable: true })
  dob: string;

  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn({ name: 'uid', referencedColumnName: 'id' })
  user: User;

  @BeforeInsert()
  setInitUserProfile() {
    if (!this.first_nane || !this.last_name || this.middle_name) this.first_nane = this.initUserName;
    if (!this.gender) this.gender = EUserGender.OTHER;
  }
}

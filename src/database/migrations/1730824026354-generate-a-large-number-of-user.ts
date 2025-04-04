// import { MigrationInterface, QueryRunner } from 'typeorm';

// export class Generate1MilionsUser1743670489931 implements MigrationInterface {
//   name = 'Generate1MilionsUser1743670489931';

//   public async up(queryRunner: QueryRunner): Promise<void> {
//     const start_time = new Date()
//     console.log('Start_time...', start_time.toISOString())
//     for(let i = 0; i<1000000;i++){
//         let phoneNum = `032000${i}`;
//         let usr = i % 2 == 0 ? phoneNum : `usr${phoneNum}@gmail.com`
//         let usr_type = i % 2 == 0 ? 'phone_number' : 'email'
//         await queryRunner.query(`
//             INSERT INTO public."user"
//             (id, "type", usr, "password", "PIN", usr_type, avatar, phone_number, email, login_type, active, state)
//             VALUES(${i+1000}, 'PERSONAL', '${usr}', '$2b$10$gt.cDP4WfwLCM42v3VSHZO949MfNib.4s8FXs47dYkge/Reqd/rW.', NULL, '${usr_type}', NULL, '${phoneNum}', NULL, 0, 1, NULL);
//         `)
//     }
//     const end_time = new Date()
//     console.log('End_time...', end_time.toISOString())
//     console.log('Total time...', end_time.getTime() - start_time.getTime())
//   }

//   public async down(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.query(`DELETE from "user" where id > 1000`);
//   }
// }

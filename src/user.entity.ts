import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
  id: string;

  @Column({ length: 60 })
  email: string;
  
  @Column({ length: 30 })
  name: string;

  @Column({ length: 30 })
  password: string;

  @Column({ length: 1024,  nullable: true })
  jwtRefreshToken: string;

  @Column({ default: 3 })
  accessLevel: number;

  @Column({ type: 'timestamptz',  nullable: true })
  lastActivate: string;

  @Column({ length: 60 })
  signupVerifyToken: string;

  // panviRD, AI, system 3개 가능
  @Column("text", { array: true, default: {} })
  affiliatedInstitutions: string[];

}
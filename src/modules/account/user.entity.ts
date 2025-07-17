import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { IsNotEmpty, IsEmail } from 'class-validator';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column()
  full_name: string;

  @Column({ unique: true, nullable: false })
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @Column()
  hash_password: string;

  @Column({ nullable: true })
  phone_number: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ type: 'date', nullable: true })
  birthday: Date;

  @Column({ nullable: true })
  address: string;

  @Column({ default: 'customer' })
  role: string; // admin/customer

  @Column({ nullable: true })
  avatar_img: string;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  registered_at: Date;
}

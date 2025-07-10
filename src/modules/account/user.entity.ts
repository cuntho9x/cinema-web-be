import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cardNumber: string;

  @Column()
  level: 'bronze' | 'silver' | 'gold' | 'plat' | 'diamond';

  @Column()
  registeredAt: Date;

  @Column()
  lastName: string;

  @Column()
  firstName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // hashed password

  @Column()
  phone: string;

  @Column()
  gender: string;

  @Column({ type: 'date' })
  birthDate: string;

  @Column()
  city: string;

  @Column()
  address: string;
}

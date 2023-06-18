import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Transaction } from "./Transaction";
import { Appointment } from "./Appointment";

@ObjectType()
@Entity()
export class Member extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: Number;

  @Field()
  @Column()
  firstName: String;

  @Field()
  @Column()
  lastName: String;

  @Field()
  @Column()
  age: Number;

  @Field()
  @Column()
  phone_number: String;

  @Field()
  @Column()
  address: String;

  @OneToMany(() => Transaction, (transaction) => transaction.member)
  transactions: Transaction[];

  @OneToMany(() => Appointment, (appointment) => appointment.member)
  appointments: Appointment[];

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}

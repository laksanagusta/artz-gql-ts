import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Member } from "./Member";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class Appointment extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: Number;

  @Field()
  @Column()
  title: String;

  @Field()
  @Column()
  scheduled_at: String;

  @Field()
  @Column()
  day_text: String;

  @Field(() => Member)
  @ManyToOne(() => Member, (member) => member.appointments)
  member: Member;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}

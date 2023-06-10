import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { Medicine } from "./Medicine";
import { Member } from "./Member";

@ObjectType()
@Entity()
export class Transaction extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ type: "text" })
  complaint: string;

  @Field()
  @Column({ type: "text" })
  symptom: string;

  @Field()
  @Column({ type: "text" })
  diagnosis: string;

  @Field()
  @Column({ type: "text" })
  actions: string;

  @Field(() => [Medicine])
  @ManyToMany(() => Medicine, { cascade: true })
  @JoinTable()
  medicines: Medicine[];

  @Field(() => Member)
  @ManyToOne(() => Member, (member) => member.transactions)
  member: Member;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}

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
import { Case } from "./Case";
import { Symptom } from "./Symptom";

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

  @Field(() => [Case])
  @ManyToMany(() => Case, { cascade: true })
  @JoinTable()
  cases: Case[];

  @Field(() => [Symptom])
  @ManyToMany(() => Symptom, { cascade: true })
  @JoinTable()
  symptoms: Symptom[];

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

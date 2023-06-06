import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";

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

  @Field()
  @Column({ type: "text" })
  recipe: string;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}

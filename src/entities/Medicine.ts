import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity()
export class Medicine extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: Number;

  @Field()
  @Column()
  name: String;
}

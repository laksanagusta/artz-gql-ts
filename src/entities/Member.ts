import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity()
export class Member extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id: Number

    @Field()
    @Column()
    name: String

    @Field()
    @Column()
    age: Number

    @Field()
    @Column()
    phone_number: String

    @Field()
    @Column()
    address: String
}
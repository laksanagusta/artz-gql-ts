import {
  Arg,
  Field,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { Member } from "../entities/Member";
import { connectionSource } from "../config/ormconfig";
import { Repository } from "typeorm";
import { isAuth } from "../middleware/auth";
// import { MyContext } from "src/types";
// import memberCreateSchema from "../validations/MemberValidation";

@InputType()
class MemberInput {
  @Field()
  name: string;
  @Field()
  age: number;
  @Field()
  phone_number: string;
  @Field()
  address: string;
}

@Resolver()
export class MemberResolver {
  _memberRepo: Repository<Member>;
  constructor() {
    this._memberRepo = connectionSource.getRepository(Member);
  }

  @Mutation(() => Member)
  async createMember(@Arg("input") input: MemberInput): Promise<Member> {
    // const validate = await memberCreateSchema.validate(input);
    return await Member.create({
      ...input,
    }).save();
  }

  @Mutation(() => Member, { nullable: true })
  async updateMember(
    @Arg("id", () => Int) id: any,
    @Arg("input") input: MemberInput
  ): Promise<Member> {
    const result = await connectionSource
      .createQueryBuilder()
      .update(Member)
      .set({
        name: input.name,
        age: input.age,
        phone_number: input.phone_number,
        address: input.address,
      })
      .where("id = :id", { id: id })
      .execute();

    return result.raw[0];
  }

  @Query(() => Member, { nullable: true })
  async member(@Arg("id", () => Int) id: any): Promise<Member | null> {
    const member = await this._memberRepo.findOneBy({
      id: id,
    });

    return member;
  }

  @Query(() => [Member], { nullable: true })
  @UseMiddleware(isAuth)
  async searchMember(
    @Arg("phone_number", () => String, { nullable: true }) phone_number: any,
    @Arg("name", () => String, { nullable: true }) name: any
  ): Promise<Member[] | null> {
    const members = this._memberRepo.find({
      where: {
        name: name,
        phone_number: phone_number,
      },
    });

    return members;
  }
}

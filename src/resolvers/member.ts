import {
  Arg,
  Field,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { Member } from "../entities/Member";
import { connectionSource } from "../config/ormconfig";
import { Repository } from "typeorm";
import { isAuth } from "../middleware/auth";

@InputType()
class MemberInput {
  @Field()
  firstName: string;
  @Field()
  lastName: string;
  @Field()
  age: number;
  @Field()
  phone_number: string;
  @Field()
  address: string;
}

@ObjectType()
class SearchMemberResult {
  @Field()
  count: number;
  @Field(() => [Member])
  members: Member[];
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
  @UseMiddleware(isAuth)
  async updateMember(
    @Arg("id", () => Int) id: any,
    @Arg("input") input: MemberInput
  ): Promise<Member> {
    const result = await connectionSource
      .createQueryBuilder()
      .update(Member)
      .set({
        firstName: input.firstName,
        lastName: input.lastName,
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

  @Query(() => SearchMemberResult, { nullable: true })
  async searchMember(
    @Arg("name", () => String, { nullable: true }) name: any,
    @Arg("limit", () => Number, { nullable: true }) limit: any,
    @Arg("page", () => Number, { nullable: true }) page: any
  ): Promise<SearchMemberResult | null> {
    const offset = page * limit;

    const members = this._memberRepo.createQueryBuilder("member");

    if (name) {
      members.where(
        "lower(member.firstName) LIKE :name OR lower(member.lastName) LIKE :name",
        {
          name: `%${name.toLowerCase()}%`,
        }
      );
    }

    const count = await members.getCount();

    if (page) {
      members.skip(offset);
    }

    if (limit) {
      members.take(limit);
    }

    members.orderBy("member.id", "DESC");

    const memberResult = await members.getMany();

    return {
      count,
      members: memberResult,
    };
  }
}

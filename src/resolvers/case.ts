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
  // UseMiddleware,
} from "type-graphql";
import { Case } from "../entities/Case";
import { connectionSource } from "../config/ormconfig";
import { Repository } from "typeorm";
import { isAuth } from "../middleware/auth";

@InputType()
export class CaseInput {
  @Field()
  name: string;

  @Field()
  description: string;
}

@ObjectType()
export class SearchCaseResult {
  @Field()
  count: number;
  @Field(() => [Case])
  cases: Case[];
}
@ObjectType()
export class CaseNotFound {
  @Field()
  message: string;
}

@Resolver()
export class CaseResolver {
  _caseRepo: Repository<Case>;
  constructor() {
    this._caseRepo = connectionSource.getRepository(Case);
  }

  @Mutation(() => Case)
  async createCase(@Arg("input") input: CaseInput): Promise<Case> {
    return await Case.create({
      ...input,
    }).save();
  }

  @Mutation(() => Case, { nullable: true })
  @UseMiddleware(isAuth)
  async updateCase(
    @Arg("id", () => Int) id: any,
    @Arg("input") input: CaseInput
  ): Promise<Case> {
    const result = await connectionSource
      .createQueryBuilder()
      .update(Case)
      .set({
        name: input.name,
        description: input.description,
      })
      .where("id = :id", { id: id })
      .execute();

    return result.raw[0];
  }

  @Query(() => Case, { nullable: true })
  async caseFindById(
    @Arg("id", () => Int) id: any
  ): Promise<Case | CaseNotFound> {
    try {
      const caseRes = await this._caseRepo.findOneBy({
        id: id,
      });

      if (!caseRes) {
        return {
          message: "Data Not found",
        };
      }

      return caseRes;
    } catch (error) {
      return {
        message: "Data Not found",
      };
    }
  }

  @Query(() => SearchCaseResult, { nullable: true })
  async searchCase(
    @Arg("name", () => String, { nullable: true }) name: any,
    @Arg("limit", () => Number, { nullable: true }) limit: any,
    @Arg("page", () => Number, { nullable: true }) page: any
  ): Promise<SearchCaseResult | null> {
    const cases = this._caseRepo.createQueryBuilder("case");

    const offset = page * limit;

    if (name) {
      cases.where("lower(case.name) LIKE :name", {
        name: `%${name.toLowerCase()}%`,
      });
    }

    const count = await cases.getCount();

    if (page) {
      cases.skip(offset);
    }

    if (limit) {
      cases.take(limit);
    }

    cases.orderBy("case.id", "DESC");

    const caseResult = await cases.getMany();

    return {
      count,
      cases: caseResult,
    };
  }
}

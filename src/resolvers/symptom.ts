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
import { Symptom } from "../entities/Symptom";
import { connectionSource } from "../config/ormconfig";
import { Repository } from "typeorm";
import { isAuth } from "../middleware/auth";

@InputType()
class SymptomInput {
  @Field()
  name: string;
}

@ObjectType()
class SearchSymptomResult {
  @Field()
  count: number;
  @Field(() => [Symptom])
  symptoms: Symptom[];
}

@Resolver()
export class SymptomResolver {
  _symptomRepo: Repository<Symptom>;
  constructor() {
    this._symptomRepo = connectionSource.getRepository(Symptom);
  }

  @Mutation(() => Symptom)
  async createSymptom(@Arg("input") input: SymptomInput): Promise<Symptom> {
    return await Symptom.create({
      ...input,
    }).save();
  }

  @Mutation(() => Symptom, { nullable: true })
  @UseMiddleware(isAuth)
  async updateSymptom(
    @Arg("id", () => Int) id: any,
    @Arg("input") input: SymptomInput
  ): Promise<Symptom> {
    const result = await connectionSource
      .createQueryBuilder()
      .update(Symptom)
      .set({
        name: input.name,
      })
      .where("id = :id", { id: id })
      .execute();

    return result.raw[0];
  }

  @Query(() => Symptom, { nullable: true })
  async symptom(@Arg("id", () => Int) id: any): Promise<Symptom | null> {
    const symptom = await this._symptomRepo.findOneBy({
      id: id,
    });

    return symptom;
  }

  @Query(() => SearchSymptomResult, { nullable: true })
  async searchSymptom(
    @Arg("name", () => String, { nullable: true }) name: any,
    @Arg("limit", () => Number, { nullable: true }) limit: any,
    @Arg("page", () => Number, { nullable: true }) page: any
  ): Promise<SearchSymptomResult | null> {
    const symptoms = this._symptomRepo.createQueryBuilder("symptom");

    const offset = page * limit;

    if (name) {
      symptoms.where("lower(symptom.name) LIKE :name", {
        name: `%${name.toLowerCase()}%`,
      });
    }

    const count = await symptoms.getCount();

    if (page) {
      symptoms.skip(offset);
    }

    if (limit) {
      symptoms.take(limit);
    }

    symptoms.orderBy("symptom.id", "DESC");

    const symptomResult = await symptoms.getMany();

    return {
      count,
      symptoms: symptomResult,
    };
  }
}

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
import { Medicine } from "../entities/Medicine";
import { connectionSource } from "../config/ormconfig";
import { Repository } from "typeorm";
import { isAuth } from "../middleware/auth";

@InputType()
class MedicineInput {
  @Field()
  name: string;
  @Field()
  createdAt: Date;
  @Field()
  updatedAt: Date;
}

@ObjectType()
class SearchMedicineResult {
  @Field()
  count: number;
  @Field(() => [Medicine])
  medicines: Medicine[];
}

@Resolver()
export class MedicineResolver {
  _medicineRepo: Repository<Medicine>;
  constructor() {
    this._medicineRepo = connectionSource.getRepository(Medicine);
  }

  @Mutation(() => Medicine)
  async createMedicine(@Arg("input") input: MedicineInput): Promise<Medicine> {
    return await Medicine.create({
      ...input,
    }).save();
  }

  @Mutation(() => Medicine, { nullable: true })
  @UseMiddleware(isAuth)
  async updateMedicine(
    @Arg("id", () => Int) id: any,
    @Arg("input") input: MedicineInput
  ): Promise<Medicine> {
    const result = await connectionSource
      .createQueryBuilder()
      .update(Medicine)
      .set({
        name: input.name,
      })
      .where("id = :id", { id: id })
      .execute();

    return result.raw[0];
  }

  @Query(() => Medicine, { nullable: true })
  async medicine(@Arg("id", () => Int) id: any): Promise<Medicine | null> {
    const medicine = await this._medicineRepo.findOneBy({
      id: id,
    });

    return medicine;
  }

  @Query(() => SearchMedicineResult, { nullable: true })
  async searchMedicine(
    @Arg("name", () => String, { nullable: true }) name: any,
    @Arg("limit", () => Number, { nullable: true }) limit: any,
    @Arg("page", () => Number, { nullable: true }) page: any
  ): Promise<SearchMedicineResult | null> {
    const medicines = this._medicineRepo.createQueryBuilder("medicine");

    if (name) {
      medicines.where("lower(medicine.name) LIKE :name", {
        name: `%${name.toLowerCase()}%`,
      });
    }

    const count = await medicines.getCount();

    if (page) {
      medicines.skip(page);
    }

    if (limit) {
      medicines.take(limit);
    }

    medicines.orderBy("medicine.id", "DESC");

    const medicineResult = await medicines.getMany();

    return {
      count,
      medicines: medicineResult,
    };
  }
}

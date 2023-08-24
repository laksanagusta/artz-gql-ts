import { connectionSource } from "src/config/ormconfig";
import { Case } from "src/entities/Case";
import { CaseInput } from "src/resolvers/case";

export const create = async (input: CaseInput): Promise<Case> => {
  const newcase = await connectionSource
    .getRepository(Case)
    .createQueryBuilder("case")
    .where("lower(case.name) LIKE :name", {
      name: `%${input.name.toLowerCase()}%`,
    })
    .execute();

  if (newcase.length) {
    throw new Error("Data already exist");
  }

  return await Case.create({
    ...input,
  }).save();
};

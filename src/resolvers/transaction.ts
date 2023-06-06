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
import { Transaction } from "../entities/Transaction";
import { connectionSource } from "../config/ormconfig";
import { Repository } from "typeorm";
import { isAuth } from "../middleware/auth";

@InputType()
class TransactionInput {
  @Field()
  complaint: string;
  @Field()
  symptom: string;
  @Field()
  diagnosis: string;
  @Field()
  actions: string;
  @Field()
  recipe: string;
}

@Resolver()
export class TransactionResolver {
  _transactionRepo: Repository<Transaction>;
  constructor() {
    this._transactionRepo = connectionSource.getRepository(Transaction);
  }

  @Mutation(() => Transaction)
  async createTransaction(
    @Arg("input") input: TransactionInput
  ): Promise<Transaction> {
    return await Transaction.create({
      ...input,
    }).save();
  }

  @Mutation(() => Transaction, { nullable: true })
  async updateTransaction(
    @Arg("id", () => Int) id: any,
    @Arg("input") input: TransactionInput
  ): Promise<Transaction> {
    const result = await connectionSource
      .createQueryBuilder()
      .update(Transaction)
      .set({
        ...input,
      })
      .where("id = :id", { id: id })
      .execute();

    return result.raw[0];
  }

  @Query(() => Transaction, { nullable: true })
  async transaction(
    @Arg("id", () => Int) id: any
  ): Promise<Transaction | null> {
    const transaction = await this._transactionRepo.findOneBy({
      id: id,
    });

    return transaction;
  }

  @Query(() => [Transaction], { nullable: true })
  @UseMiddleware(isAuth)
  async searchTransaction(
    @Arg("complaint", () => String, { nullable: true }) complaint: any
  ): Promise<Transaction[] | null> {
    const transactions = this._transactionRepo.find({
      where: {
        complaint: complaint,
      },
    });

    return transactions;
  }
}

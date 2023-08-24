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
import { Transaction } from "../entities/Transaction";
import { connectionSource } from "../config/ormconfig";
import { Repository } from "typeorm";
import { isAuth } from "../middleware/auth";

@InputType()
class MedicineTransactionInput {
  @Field()
  id: number;
}

@InputType()
class MemberTransactionInput {
  @Field()
  id: number;
}

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
  @Field(() => [MedicineTransactionInput])
  medicines?: MedicineTransactionInput[];
  @Field(() => MemberTransactionInput)
  member?: MemberTransactionInput;
}

@ObjectType()
class SearchTransactionResult {
  @Field()
  count: number;
  @Field(() => [Transaction])
  transactions: Transaction[];
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
    const transaction = await this._transactionRepo.findOne({
      where: { id: id },
      relations: ["medicines", "member", "case", "symptom"],
    });

    return transaction;
  }

  @Query(() => SearchTransactionResult, { nullable: true })
  @UseMiddleware(isAuth)
  async searchTransaction(
    @Arg("searchParam", () => String, { nullable: true }) searchParam: any,
    @Arg("limit", () => Number, { nullable: true }) limit: any,
    @Arg("page", () => Number, { nullable: true }) page: any
  ): Promise<SearchTransactionResult | null> {
    const offset = page * limit;

    const transactions = this._transactionRepo
      .createQueryBuilder("transaction")
      .leftJoinAndSelect("transaction.member", "member");

    if (searchParam) {
      const searchParamLower = searchParam.toLowerCase();
      transactions
        .where("lower(transaction.complaint) LIKE :complaint", {
          complaint: `%${searchParamLower}%`,
        })
        .orWhere("lower(member.firstName) LIKE :firstName", {
          firstName: `%${searchParamLower}%`,
        });
    }

    const count = await transactions.getCount();

    if (page) {
      transactions.skip(offset);
    }

    if (limit) {
      transactions.take(limit);
    }

    transactions.orderBy("transaction.id", "DESC");

    const transactionResult = await transactions.getMany();

    return {
      count,
      transactions: transactionResult,
    };
  }
}

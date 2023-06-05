import { Query, Resolver } from "type-graphql";

@Resolver()
export class TransactionResolver {
    @Query(() => String)
    transaction() {
        return "test resolver";
    }
}
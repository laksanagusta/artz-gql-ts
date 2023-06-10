import "reflect-metadata";
import { __prod__ } from "./constants";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { connectionSource } from "./config/ormconfig";
import "dotenv-safe/config";
import { MemberResolver } from "./resolvers/member";
import { TransactionResolver } from "./resolvers/transaction";
import { UserResolver } from "./resolvers/user";
import { Medicine } from "./entities/Medicine";

const main = async () => {
  await connectionSource.initialize();

  await connectionSource.runMigrations();

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [MemberResolver, TransactionResolver, UserResolver, Medicine],
      validate: false,
    }),
    context: ({ req, res }) => ({
      req,
      res,
    }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("server is running");
  });
};

main().catch((err) => {
  console.error(err);
});

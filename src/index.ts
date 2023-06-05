import "reflect-metadata";
import { __prod__ } from "./constants";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { connectionSource } from "./config/ormconfig";
import "dotenv-safe/config";
import { MemberResolver } from "./resolvers/member";

const main = async () => {
  await connectionSource.initialize();

  await connectionSource.runMigrations();

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [MemberResolver],
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

import "reflect-metadata";
import { __db_url, __port, __prod__ } from "./constants";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { connectionSource } from "./config/ormconfig";
import "dotenv-safe/config";
import { MemberResolver } from "./resolvers/member";
import { TransactionResolver } from "./resolvers/transaction";
import { UserResolver } from "./resolvers/user";
import { MedicineResolver } from "./resolvers/medicine";
import { CaseResolver } from "./resolvers/case";
import { SymptomResolver } from "./resolvers/symptom";
import { AppointmentResolver } from "./resolvers/appointment";

const main = async () => {
  await connectionSource.initialize();

  await connectionSource.runMigrations();

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        AppointmentResolver,
        CaseResolver,
        MedicineResolver,
        MemberResolver,
        SymptomResolver,
        TransactionResolver,
        UserResolver,
      ],
      validate: false,
    }),
    context: ({ req, res }) => ({
      req,
      res,
    }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  app.listen(__port, () => {
    console.log("server is running");
  });
};

main().catch((err) => {
  console.error(err);
});

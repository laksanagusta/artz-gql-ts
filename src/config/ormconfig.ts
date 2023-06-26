import { __db_url, __prod__ } from "../constants";
import { DataSource } from "typeorm";
import "dotenv-safe/config";

export const connectionSource = new DataSource({
  migrationsTableName: "migrations",
  type: "postgres",
  url: __db_url,
  logging: !__prod__,
  synchronize: false,
  name: "default",
  subscribers: ["dist/subscribers/*.js"],
  entities: ["dist/entities/*.js"],
  migrations: ["dist/migrations/*.js"],
});

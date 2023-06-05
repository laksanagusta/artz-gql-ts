import { __prod__ } from "../constants";
import { DataSource } from "typeorm";
import "dotenv-safe/config";

export const connectionSource = new DataSource({
    migrationsTableName: 'migrations',
    type: "postgres",
    url: process.env.DATABASE_URL,
    logging: !__prod__,
    synchronize: false,
    name: 'default',
    entities: ['dist/entities/*.js'],
    migrations: ['dist/migrations/*.js']
});
import { DataSourceOptions } from "typeorm";
import { CreateUsersTable1765154557593 } from "../database/migrations/1765154557593-create_users_table";

export const databaseConfig: DataSourceOptions = {
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: Number.parseInt(process.env.DB_PORT || "3306", 10),
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_DATABASE || "online_catalog",
    synchronize: false,
    logging: process.env.NODE_ENV !== "production",
    entities: ["src/**/*.entity.ts"],
    migrations: [CreateUsersTable1765154557593],
};

import { DataSourceOptions } from "typeorm";
import { CreateUsersTable1765154557593 } from "../config/database/migrations/1765154557593-create_users_table";
import { CreateStoresTable1765229557541 } from "./database/migrations/1765229557541-create_stores_table";
import { CreateProductsTable1765302063540 } from "./database/migrations/1765302063540-create_products_table";
import { CreateProductImagesTable1765369415761 } from "./database/migrations/1765369415761-create_product_images_table";

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
    migrations: [
        CreateUsersTable1765154557593,
        CreateStoresTable1765229557541,
        CreateProductsTable1765302063540,
        CreateProductImagesTable1765369415761,
    ],
};

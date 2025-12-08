import { databaseConfig } from "src/config/database.config";
import { DataSource } from "typeorm";

const dataSource = new DataSource({ ...databaseConfig });

export default dataSource;

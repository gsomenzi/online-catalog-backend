import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductsTable1765302063540 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`products\` (
                \`id\` VARCHAR(36) NOT NULL,
                \`name\` VARCHAR(255) NOT NULL,
                \`description\` TEXT NULL,
                \`price\` DECIMAL(10, 2) NOT NULL,
                \`store_id\` VARCHAR(36) NOT NULL,
                \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                \`updated_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                \`deleted_at\` DATETIME NULL,
                PRIMARY KEY (\`id\`),
                INDEX \`IDX_PRODUCTS_STORE_ID\` (\`store_id\`),
                CONSTRAINT \`fk_products_store_id\` FOREIGN KEY (\`store_id\`) REFERENCES \`stores\`(\`id\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `products`");
    }
}

import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateStoresTable1765229557541 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`stores\` (
                \`id\` VARCHAR(36) NOT NULL,
                \`name\` VARCHAR(255) NOT NULL,
                \`user_id\` VARCHAR(36) NOT NULL,
                \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                \`updated_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                \`deleted_at\` DATETIME NULL,
                PRIMARY KEY (\`id\`),
                INDEX \`IDX_STORES_USER_ID\` (\`user_id\`),
                CONSTRAINT \`fk_stores_user_id\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `stores`");
    }
}

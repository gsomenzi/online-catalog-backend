import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductImagesTable1765369415761 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`product_images\` (
                \`id\` VARCHAR(36) NOT NULL,
                \`product_id\` VARCHAR(36) NOT NULL,
                \`file_path\` VARCHAR(255) NOT NULL,
                \`file_name\` VARCHAR(255) NOT NULL,
                \`mime_type\` VARCHAR(100) NOT NULL,
                \`size\` BIGINT NOT NULL,
                \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (\`id\`),
                INDEX \`IDX_PRODUCT_IMAGES_PRODUCT_ID\` (\`product_id\`),
                CONSTRAINT \`fk_product_images_product_id\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `product_images`");
    }
}

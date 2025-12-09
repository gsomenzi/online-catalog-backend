import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateStoresTable1765229557541 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE stores (
                id VARCHAR(36) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                user_id VARCHAR(36) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                deleted_at TIMESTAMP NULL,
                CONSTRAINT fk_stores_user_id FOREIGN KEY (user_id) REFERENCES users(id)
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE stores");
    }
}
